import { createFileRoute } from "@tanstack/react-router";
import IssueDetail from "../../../../../components/IssueDetail";

export const Route = createFileRoute("/repo/$owner/$name/issues/$issueNumber")({
	component: IssueDetail,
});
