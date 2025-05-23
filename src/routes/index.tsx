import { createFileRoute } from "@tanstack/react-router";
import RepoSearch from "../components/RepoSearch";

export const Route = createFileRoute("/")({
	component: RepoSearch,
});

export default function Home() {
	return (
		<div>
			<RepoSearch />
		</div>
	);
}
