import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { graphql, usePreloadedQuery } from "react-relay";
import { Loader } from "./Loader";
import type { IssuesListProps, LabelNode } from "./utils/types-helper";

export const ISSUES_LIST_QUERY = graphql`
  query IssuesListQuery($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      issues(first: 10, after: $after, orderBy: { field: CREATED_AT, direction: DESC }) {
        nodes {
          number
          title
          createdAt
          labels(first: 5) { nodes { name color } }
        }
        pageInfo { endCursor hasNextPage }
      }
    }
  }
`;

export default function IssuesList({
	owner,
	name,
	preloadedQuery,
}: IssuesListProps) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [allIssues, setAllIssues] = useState<any[]>([]);
	const [after, setAfter] = useState<string | null>(null);
	const [loadingMore, setLoadingMore] = useState(false);

	const data = usePreloadedQuery(ISSUES_LIST_QUERY, preloadedQuery);

	// Initialize issue list if it is the first page
	useEffect(() => {
		if (!after) {
			setAllIssues([...(data.repository?.issues.nodes ?? [])]);
		}
	}, [data.repository?.issues.nodes, after]);

	const pageInfo = data.repository?.issues.pageInfo;

	const loaderRef = useRef<HTMLDivElement>(null);

	const loadMore = useCallback(async () => {
		if (!pageInfo?.hasNextPage || loadingMore) return;
		setLoadingMore(true);

		// Refetch the next page
		const moreData = await fetchNextPage(pageInfo.endCursor ?? null);
		if (moreData) {
			const moreIssues = moreData.repository?.issues.nodes ?? [];
			setAllIssues((prev) => [...prev, ...moreIssues]);
		}
		setAfter(pageInfo.endCursor ?? null);
		setLoadingMore(false);
	}, [pageInfo, loadingMore]);

	async function fetchNextPage(afterCursor: string | null) {
		return await fetchGraphQL(owner, name, afterCursor);
	}

	async function fetchGraphQL(
		owner: string,
		name: string,
		afterCursor: string | null,
	) {
		const query = `
			query IssuesListQuery($owner: String!, $name: String!, $after: String) {
				repository(owner: $owner, name: $name) {
					issues(first: 10, after: $after, orderBy: { field: CREATED_AT, direction: DESC }) {
						nodes { number title createdAt labels(first: 5) { nodes { name color } } }
						pageInfo { endCursor hasNextPage }
					}
				}
			}
		`;
		const variables = { owner, name, after: afterCursor };
		const res = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${import.meta.env.VITE_GH_TOKEN}`,
			},
			body: JSON.stringify({ query, variables }),
		});
		return res.json().then((json) => json.data);
	}

	//Adds infinite scroll functionality
	useEffect(() => {
		if (!loaderRef.current || !pageInfo?.hasNextPage) return;
		const observer = new window.IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !loadingMore) {
				loadMore();
			}
		});
		observer.observe(loaderRef.current);
		return () => observer.disconnect();
	}, [loadMore, pageInfo?.hasNextPage, loadingMore]);

	return (
		<div className="max-w-2xl mx-auto p-6">
			<ScrollArea.Root
				type="auto"
				className="h-[1000px] w-full rounded overflow-hidden bg-gray-50 border border-gray-200"
			>
				<ScrollArea.Viewport className="h-full w-full">
					<ul>
						{allIssues.map((issue, idx) => (
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
						{loadingMore && <Loader />}
						{!pageInfo?.hasNextPage && (
							<span className="text-gray-500">No more issues.</span>
						)}
					</div>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar orientation="vertical" />
			</ScrollArea.Root>
		</div>
	);
}
