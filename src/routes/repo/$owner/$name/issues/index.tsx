import { createFileRoute } from "@tanstack/react-router";
import IssuesList from "../../../../../components/IssuesList";

export const Route = createFileRoute("/repo/$owner/$name/issues/")({
	component: IssuesList,
});
