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

export interface IssueLabels {
	nodes?: LabelNode[] | null;
}

export interface IssueNode {
	number?: number;
	title?: string;
	createdAt?: string;
	labels?: IssueLabels | null;
}

export type LabelNode = {
	name: string;
	color: string;
};

export type IssuesListProps = {
	preloadedQuery: PreloadedQuery<IssuesListQuery>;
	owner: string;
	name: string;
};
