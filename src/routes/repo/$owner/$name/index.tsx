import { createFileRoute } from "@tanstack/react-router";
import RepoInfo from "../../../../components/RepoInfo";

//validate and sanitize the route parameters if using in real world backend
export const Route = createFileRoute("/repo/$owner/$name/")({
	component: RepoInfo,
});
