import { useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";

const RepoSearch: React.FC = () => {
	const [repo, setRepo] = useState<string>("");
	const navigate = useNavigate();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const [owner, name] = repo.trim().split("/");
		if (!owner || !name) {
			alert("Format: owner/repo");
			return;
		}
		navigate({
			to: "/repo/$owner/$name",
			params: { owner, name },
		});
	};

	return (
		<div className="fixed top-6 left-6 z-50">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow flex flex-col items-center"
			>
				<label
					htmlFor="repo-input"
					className="block mb-2 text-lg font-semibold"
				>
					GitHub Repo
				</label>
				<input
					id="repo-input"
					className="border rounded p-2 w-64 mb-3"
					placeholder="owner/repo"
					value={repo}
					onChange={(e) => setRepo(e.target.value)}
				/>
				<button
					type="submit"
					className="
						mt-2
						px-6
						py-2.5
						bg-green-600
						text-white
						font-semibold
						rounded-lg
						hover:bg-green-700
						focus:outline-none
						focus:ring-2
						focus:ring-green-400
						focus:ring-offset-2
						shadow
						transition
						w-full
						max-w-xs
					"
				>
					Search
				</button>
			</form>
		</div>
	);
};

export default RepoSearch;
