import { useState, useEffect } from "react";
import { Link } from "react-router";
import { RiBookmarkLine, RiLoginCircleLine } from "react-icons/ri";
import NewsCard from "../components/NewsCard";
import { getMyBookmarks } from "../lib/api";
import { useSession } from "../lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function NewsCardSkeleton() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-48 w-full rounded-lg" />
			<Skeleton className="h-4 w-1/3" />
			<Skeleton className="h-5 w-full" />
			<Skeleton className="h-4 w-full" />
		</div>
	);
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
	return (
		<div className="flex flex-col items-center justify-center text-center py-20 px-4">
			<div className="rounded-full bg-muted p-4 mb-4">
				<Icon className="h-8 w-8 text-muted-foreground" />
			</div>
			<h2 className="text-lg font-semibold mb-1">{title}</h2>
			<p className="text-sm text-muted-foreground mb-6 max-w-sm">
				{description}
			</p>
			<Button asChild>
				<Link to={actionTo}>{actionLabel}</Link>
			</Button>
		</div>
	);
}

export default function Bookmarks() {
	const { data: session, isPending } = useSession();
	const [bookmarks, setBookmarks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!session) {
			setLoading(false);
			return;
		}

		async function loadBookmarks() {
			try {
				const data = await getMyBookmarks();
				setBookmarks(data);
			} finally {
				setLoading(false);
			}
		}

		loadBookmarks();
	}, [session]);

	function handleRemove(articleId) {
		setBookmarks((prev) => prev.filter((b) => b.article.id !== articleId));
	}

	if (isPending || loading) {
		return (
			<div className="p-4 sm:p-6">
				<h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
						<NewsCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (!session) {
		return (
			<EmptyState
				icon={RiLoginCircleLine}
				title="Login required"
				description="Please log in to view and manage your bookmarked articles."
				actionLabel="Go to Login"
				actionTo="/login"
			/>
		);
	}

	if (bookmarks.length === 0) {
		return (
			<EmptyState
				icon={RiBookmarkLine}
				title="No bookmarks yet"
				description="Articles you bookmark will show up here. Start browsing to save your favorites."
				actionLabel="Browse Articles"
				actionTo="/"
			/>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			<h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{bookmarks.map((bookmark) => (
					<NewsCard
						key={bookmark.article.id}
						article={bookmark.article}
						initialBookmarked={true}
						onRemove={handleRemove}
					/>
				))}
			</div>
		</div>
	);
}
