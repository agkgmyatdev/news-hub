import { Link } from "react-router";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t mt-12">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center gap-4">
				<div className="text-center">
					<p className="text-sm text-muted-foreground">
						© {year} NewsHub. Powered by NewsAPI.org
					</p>
				</div>

				<div className="flex items-center gap-4">
					<Link
						to="/"
						className="text-sm text-muted-foreground hover:text-foreground">
						Home
					</Link>
					<Link
						to="/bookmarks"
						className="text-sm text-muted-foreground hover:text-foreground">
						Bookmarks
					</Link>
				</div>
			</div>
		</footer>
	);
}
