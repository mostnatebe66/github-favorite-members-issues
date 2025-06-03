type User = {
	login: string;
	avatarUrl: string;
	url: string;
};

export default function Contributors({ users }: Readonly<{ users: User[] }>) {
	if (!users || users.length === 0) return null;
	return (
		<div className="my-4">
			<h2 className="font-semibold mb-2">Contributors</h2>
			<div className="flex flex-wrap gap-3">
				{users.map((u) => (
					<a
						href={u.url}
						key={u.login}
						className="flex flex-col items-center"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={u.avatarUrl}
							alt={u.login}
							className="rounded-full w-10 h-10"
						/>
						<span className="text-xs">{u.login}</span>
					</a>
				))}
			</div>
		</div>
	);
}
