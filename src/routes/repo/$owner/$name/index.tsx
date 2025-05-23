import { createFileRoute } from "@tanstack/react-router";
import RepoInfo from "../../../../components/RepoInfo";

export const Route = createFileRoute("/repo/$owner/$name/")({
	component: RepoInfo,
});
