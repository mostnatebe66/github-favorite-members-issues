import type { IssuesListQuery } from "@/utils/relay/__generated__/IssuesListQuery.graphql";
import type { PreloadedQuery } from "react-relay";

export type CommentNode = {
	id: string;
	author?: {
		login?: string | null;
		avatarUrl?: string | null;
	} | null;
	createdAt: string;
	body: string;
};

export type IssueNode = {
	title: string;
	number: number;
	createdAt: string;
	body: string;
	labels?:
		| {
				nodes?: Array<LabelNode | null> | null;
		  }
		| null
		| undefined;
};

export type LabelNode = {
	name: string;
	color: string;
};

export type IssuesListProps = {
	owner: string;
	name: string;
	preloadedQuery: PreloadedQuery<IssuesListQuery>;
};
