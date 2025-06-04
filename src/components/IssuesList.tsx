import type { IssuesListQuery } from "@/utils/relay/__generated__/IssuesListQuery.graphql";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
	type PreloadedQuery,
	graphql,
	usePaginationFragment,
	usePreloadedQuery,
} from "react-relay";
import { Loader } from "./Loader";
import type { IssueNode, LabelNode } from "./utils/types-helper";

export const ISSUES_LIST_QUERY = graphql`
  query IssuesListQuery($owner: String!, $name: String!, $count: Int!, $after: String) {
	repository(owner: $owner, name: $name) {
	  ...IssuesList_repository
	}
  }
`;

export default function IssuesList({
	preloadedQuery,
	owner,
	name,
}: Readonly<{
	preloadedQuery: PreloadedQuery<IssuesListQuery>;
	owner: string;
	name: string;
}>) {
	const data = usePreloadedQuery(ISSUES_LIST_QUERY, preloadedQuery);

	const {
		data: repo,
		loadNext,
		hasNext,
		isLoadingNext,
	} = usePaginationFragment(issuesFragment, data.repository);

	//@ts-ignore
	const allIssues = repo.issues.edges.map((edge) => edge.node);

	const loaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!loaderRef.current || !hasNext || isLoadingNext) return;
		const observer = new window.IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasNext && !isLoadingNext) {
				loadNext(10);
			}
		});
		observer.observe(loaderRef.current);
		return () => observer.disconnect();
	}, [hasNext, isLoadingNext, loadNext]);

	return (
		<div className="max-w-2xl mx-auto p-6">
			<ScrollArea.Root
				type="auto"
				className="h-[1000px] w-full rounded overflow-hidden bg-gray-50 border border-gray-200"
			>
				<ScrollArea.Viewport className="h-full w-full">
					<ul>
						{allIssues.map((issue: IssueNode, idx: number) => (
							<li
								key={issue?.number ?? idx}
								className="mb-4 p-4 rounded shadow bg-white hover:bg-blue-50 transition-colors border border-gray-200"
							>
								{issue?.number !== undefined ? (
									<Link
										// @ts-ignore
										to={`/repo/${owner}/${name}/issues/${issue.number}`}
										className="text-blue-700 font-semibold hover:underline"
									>
										{issue?.title}
									</Link>
								) : (
									<span className="text-gray-700 font-semibold">
										{issue?.title}
									</span>
								)}
								<div className="text-sm text-gray-500">
									#{issue?.number} opened{" "}
									{issue?.createdAt
										? new Date(issue.createdAt).toLocaleDateString()
										: "Unknown date"}
								</div>
								<div className="flex gap-2 mt-2">
									{issue?.labels?.nodes
										?.filter(Boolean)
										.map((label: LabelNode) =>
											label ? (
												<span
													key={label.name}
													className="px-2 py-1 text-xs rounded"
													style={{
														background: `#${label.color}`,
														color: "#fff",
													}}
												>
													{label.name}
												</span>
											) : null,
										)}
								</div>
							</li>
						))}
					</ul>
					<div ref={loaderRef} className="flex justify-center p-4">
						{isLoadingNext && <Loader />}
						{!hasNext && <span className="text-gray-500">No more issues.</span>}
					</div>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar orientation="vertical" />
			</ScrollArea.Root>
		</div>
	);
}

export const issuesFragment = graphql`
  fragment IssuesList_repository on Repository
  @refetchable(queryName: "IssuesListPaginationQuery") {
    issues(
      first: $count
      after: $after
      orderBy: { field: CREATED_AT, direction: DESC }
    ) @connection(key: "IssuesList_repository_issues") {
      edges {
        node {
          number
          title
          createdAt
          labels(first: 5) {
            nodes {
              name
              color
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
