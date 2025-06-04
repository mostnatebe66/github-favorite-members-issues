import { Route } from "@/routes/repo/$owner/$name";
import type { IssuesListQuery } from "@/utils/relay/__generated__/IssuesListQuery.graphql";
import type { RepoInfoAddStarMutation } from "@/utils/relay/__generated__/RepoInfoAddStarMutation.graphql.ts";
import type { RepoInfoQuery } from "@/utils/relay/__generated__/RepoInfoQuery.graphql";
import type { RepoInfoRemoveStarMutation } from "@/utils/relay/__generated__/RepoInfoRemoveStarMutation.graphql.ts";
import { useState } from "react";
import { graphql, loadQuery, useLazyLoadQuery, useMutation } from "react-relay";
import relayEnvironment from "../utils/relay/environment.ts";
import Contributors from "./Contributors";
import IssuesList, { ISSUES_LIST_QUERY } from "./IssuesList";
import { Loader } from "./Loader";

const REPO_INFO_QUERY = graphql`
  query RepoInfoQuery($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
	  id
      name
      description
      stargazerCount
	  viewerHasStarred
      forkCount
      refs(refPrefix: "refs/heads/", first: 0) { totalCount }
      defaultBranchRef {
        target {
          ... on Commit {
            history { totalCount }
          }
        }
      }
      mentionableUsers(first: 10) {
        nodes { login avatarUrl url }
      }
    }
  }
`;

const AddStarMutation = graphql`
  mutation RepoInfoAddStarMutation($input: AddStarInput!) {
	  addStar(input: $input) {
		clientMutationId
		starrable {
			id
			stargazerCount
			viewerHasStarred
		}
	  }
	}`;

const RemoveStarMutation = graphql`
  mutation RepoInfoRemoveStarMutation($input: RemoveStarInput!) {
	  removeStar(input: $input) {
		clientMutationId
		starrable {
			id
			stargazerCount
			viewerHasStarred
		}
	  }
	}`;

export default function RepoInfo() {
	const { owner, name } = Route.useParams();
	const [showIssues, setShowIssues] = useState(false);

	const [commitAddStarMutation] =
		useMutation<RepoInfoAddStarMutation>(AddStarMutation);
	const [commitRemoveStarMutation] =
		useMutation<RepoInfoRemoveStarMutation>(RemoveStarMutation);

	const data = useLazyLoadQuery<RepoInfoQuery>(
		REPO_INFO_QUERY,
		{ owner, name },
		{ fetchPolicy: "store-or-network" },
	);

	const preloadedIssues = loadQuery<IssuesListQuery>(
		relayEnvironment,
		ISSUES_LIST_QUERY,
		{ owner, name, after: null, count: 10 },
	);

	if (!data) return <Loader />;
	if (!data.repository) return <div className="p-6">Repository not found.</div>;

	const repo = data.repository;

	const handleToggleStar = () => {
		if (repo.viewerHasStarred) {
			commitRemoveStarMutation({
				variables: {
					input: { starrableId: repo.id },
				},
				optimisticResponse: {
					removeStar: {
						starrable: {
							id: repo.id,
							stargazerCount: Math.max(repo.stargazerCount - 1, 0),
							viewerHasStarred: false,
							__typename: "Repository",
						},
					},
				},
			});
		} else {
			commitAddStarMutation({
				variables: {
					input: { starrableId: repo.id },
				},
				optimisticResponse: {
					addStar: {
						starrable: {
							id: repo.id,
							stargazerCount: repo.stargazerCount + 1,
							viewerHasStarred: true,
							__typename: "Repository",
						},
					},
				},
			});
		}
	};

	return (
		<div className="p-6 max-w-3xl ml-0">
			<a
				href="/"
				className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold shadow no-underline"
			>
				&larr; Search Again
			</a>
			<div className="border border-gray-200 rounded p-4 mt-4 bg-white shadow">
				<h1 className="text-2xl font-bold mt-2">{repo.name}</h1>
				<p className="text-gray-700 mb-2">{repo.description}</p>
				<div className="flex space-x-6 mb-4">
					<button type="button" onClick={handleToggleStar}>
						{repo.viewerHasStarred ? "⭐" : "☆"} {repo.stargazerCount}
					</button>
					<span>🍴 {repo.forkCount}</span>
					<span>🌿 Branches: {repo.refs?.totalCount}</span>
					<span>
						⏳ Commits:{" "}
						{repo.defaultBranchRef?.target?.history?.totalCount ?? 0}
					</span>
				</div>
				<Contributors
					users={[...(repo.mentionableUsers.nodes ?? [])].filter(
						(u): u is NonNullable<typeof u> => !!u,
					)}
				/>
				<div className="flex justify-center">
					<button
						type="button"
						className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						onClick={() => setShowIssues((prev) => !prev)}
					>
						{showIssues ? "Hide Issues" : "View Issues"}
					</button>
				</div>
			</div>
			{showIssues && (
				<div className="border border-gray-200 rounded p-4 mt-4 bg-white shadow">
					<IssuesList
						owner={owner}
						name={name}
						preloadedQuery={preloadedIssues}
					/>
				</div>
			)}
		</div>
	);
}
