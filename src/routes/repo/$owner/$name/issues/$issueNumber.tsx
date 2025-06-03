import { createFileRoute } from "@tanstack/react-router";
import IssueDetail from "../../../../../components/IssueDetail";

//validate and sanitize the route parameters if using in real world backend
export const Route = createFileRoute("/repo/$owner/$name/issues/$issueNumber")({
	component: IssueDetail,
});
