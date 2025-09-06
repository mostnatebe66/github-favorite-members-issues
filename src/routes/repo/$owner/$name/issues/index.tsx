import { createFileRoute } from "@tanstack/react-router";
import IssuesList from "../../../../../components/IssuesList";

//validate and sanitize the route parameters if using in real world backend
export const Route = createFileRoute("/repo/$owner/$name/issues/")({
	component: IssuesList,
});
