import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
	RiTimeLine,
	RiNewspaperLine,
	RiArrowLeftLine,
	RiExternalLinkLine,
	RiImageLine,
} from "react-icons/ri";
import { getArticleById } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BookmarkButton from "../components/BookmarkButton";

export default function ArticleDetail() {
	const { id } = useParams();
	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		async function loadArticle() {
			try {
				setLoading(true);
				const data = await getArticleById(id);
				setArticle(data);
				setError(null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		loadArticle();
	}, [id]);

	if (loading) {
		return (
			<div className="max-w-3xl mx-auto p-6 space-y-4">
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-64 w-full rounded-lg" />
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-4 w-full" />
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className="max-w-3xl mx-auto p-6 text-center">
				<p className="text-destructive">
					{error || "Article not found"}
				</p>
				<Button variant="outline" asChild className="mt-4">
					<Link to="/">Back to Home</Link>
				</Button>
			</div>
		);
	}

	const showPlaceholder = !article.imageUrl || imageError;

	const formattedDate = new Date(article.publishedAt).toLocaleDateString(
		"en-US",
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		},
	);

	return (
		<div className="max-w-3xl mx-auto p-6">
			<Button variant="ghost" asChild className="mb-4 -ml-4">
				<Link to="/">
					<RiArrowLeftLine className="mr-2 h-4 w-4" /> Back
				</Link>
			</Button>

			{showPlaceholder ? (
				<div className="w-full h-72 bg-muted rounded-lg mb-6 flex items-center justify-center">
					<RiImageLine className="h-12 w-12 text-muted-foreground" />
				</div>
			) : (
				<img
					src={article.imageUrl}
					alt={article.title}
					className="w-full h-72 object-cover rounded-lg mb-6"
					onError={() => setImageError(true)}
				/>
			)}

			<div className="flex items-start justify-between mb-2">
				<span className="text-xs uppercase font-semibold  text-emerald-500 dark:text-emerald-400">
					{article.category}
				</span>
				<BookmarkButton articleId={article.id} />
			</div>

			<h1 className="text-3xl font-bold mb-4">{article.title}</h1>

			<div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
				<span className="flex items-center gap-1  text-emerald-500 dark:text-emerald-400">
					<RiNewspaperLine /> {article.sourceName}
				</span>
				<span className="flex items-center gap-1  text-emerald-500 dark:text-emerald-400">
					<RiTimeLine /> {formattedDate}
				</span>
			</div>

			<p className="text-base leading-relaxed mb-6">
				{article.content || article.description}
			</p>

			<Button asChild>
				<a href={article.url} target="_blank" rel="noopener noreferrer">
					Read Full Article{" "}
					<RiExternalLinkLine className="ml-2 h-3 w-3" />
				</a>
			</Button>
		</div>
	);
}
