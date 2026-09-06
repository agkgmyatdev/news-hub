import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getArticles, getMyBookmarks } from "@/lib/api";
import NewsCard from "@/components/NewsCard";

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

export default function Home() {
	const [articles, setArticles] = useState([]);
	const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);
				const [articlesData, bookmarksData] = await Promise.all([
					getArticles(),
					getMyBookmarks(),
				]);
				setArticles(articlesData);
				setBookmarkedIds(
					new Set(bookmarksData.map((b) => b.articleId)),
				);
				setError(null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, []);

	return (
		<div className="p-4 sm:p-6">
			<h1 className="text-3xl font-bold mb-6">Latest News</h1>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{loading
					? Array.from({ length: 6 }).map((_, i) => (
							<NewsCardSkeleton key={i} />
						))
					: articles.map((article) => (
							<NewsCard
								key={article.id}
								article={article}
								initialBookmarked={bookmarkedIds.has(
									article.id,
								)}
							/>
						))}
			</div>

			{!loading && !error && articles.length === 0 && (
				<p className="text-center text-muted-foreground mt-10">
					No articles found. Try syncing first.
				</p>
			)}
		</div>
	);
}
