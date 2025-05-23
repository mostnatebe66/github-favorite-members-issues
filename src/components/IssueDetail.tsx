import { Route } from "@/routes/repo/$owner/$name/issues/$issueNumber";
import type { IssueDetailQuery } from "@/utils/relay/__generated__/IssueDetailQuery.graphql";
import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Loader } from "./Loader";
import type { CommentNode } from "./utils/types-helper";

const ISSUE_DETAIL_QUERY = graphql`
  query IssueDetailQuery(
    $owner: String!,
    $name: String!,
    $number: Int!,
    $commentsAfter: String
  ) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        title
        body
        createdAt
        labels(first: 10) { nodes { name, color } }
        comments(first: 5, after: $commentsAfter, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            id
            author { login avatarUrl }
            createdAt
            body
          }
          pageInfo { endCursor hasNextPage }
        }
      }
    }
  }
`;

export default function IssueDetail() {
	const { owner, name, issueNumber } = Route.useParams();
	const [commentsAfter, setCommentsAfter] = useState<string | null>(null);

	const data = useLazyLoadQuery<IssueDetailQuery>(
		ISSUE_DETAIL_QUERY,
		{ owner, name, number: Number(issueNumber), commentsAfter },
		{ fetchPolicy: "store-or-network" },
	);

	if (!data) return <Loader />;
	if (!data.repository?.issue) return <div>Issue not found.</div>;
	const issue = data.repository.issue;
	const comments = issue.comments.nodes ?? [];
	const pageInfo = issue.comments.pageInfo;

	return (
		<div className="border border-gray-200 rounded p-4 mt-4 bg-white shadow max-w-2xl mx-auto">
			<h2 className="text-2xl font-bold mt-2 mb-4">{issue.title}</h2>
			<div className="text-gray-700 mb-4">{issue.body}</div>
			<ul className="mb-4">
				{comments.map((comment: CommentNode | null | undefined) =>
					comment ? (
						<li key={comment.id} className="flex items-center gap-2 mb-2">
							<img
								src={comment.author?.avatarUrl ?? ""}
								alt={comment.author?.login ?? ""}
								width={32}
								className="rounded-full border"
							/>
							<span className="font-semibold">{comment.author?.login}</span>
							<span className="text-gray-600">: {comment.body}</span>
						</li>
					) : null,
				)}
			</ul>
			<div className="flex justify-center">
				<button
					type="button"
					disabled={!pageInfo.hasNextPage}
					className={
						!pageInfo.hasNextPage
							? "mt-6 inline-block px-4 py-2 bg-gray-300 text-white rounded"
							: "mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					}
					onClick={() => setCommentsAfter(pageInfo.endCursor ?? null)}
				>
					Load more comments
				</button>
			</div>
		</div>
	);
}
