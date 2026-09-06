import { useState } from "react";
import { Link } from "react-router";
import { RiTimeLine, RiNewspaperLine, RiImageLine } from "react-icons/ri";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BookmarkButton from "./BookmarkButton";

export default function NewsCard({
	article,
	initialBookmarked = false,
	onRemove,
}) {
	const [imageError, setImageError] = useState(false);

	const formattedDate = new Date(article.publishedAt).toLocaleDateString(
		"en-US",
		{
			year: "numeric",
			month: "short",
			day: "numeric",
		},
	);

	const showPlaceholder = !article.imageUrl || imageError;

	return (
		<Card className="overflow-hidden py-0 gap-0">
			<Link to={`/article/${article.id}`}>
				{showPlaceholder ? (
					<div className="w-full h-48 bg-muted flex items-center justify-center">
						<RiImageLine className="h-10 w-10 text-muted-foreground" />
					</div>
				) : (
					<img
						src={article.imageUrl}
						alt={article.title}
						className="w-full h-48 object-cover"
						onError={() => setImageError(true)}
					/>
				)}
			</Link>
			<CardHeader className="pt-4">
				<div className="flex items-start justify-between">
					<span className="text-xs uppercase font-semibold mb-2 text-emerald-500 dark:text-emerald-400">
						{article.category}
					</span>
					<BookmarkButton
						articleId={article.id}
						initialBookmarked={initialBookmarked}
						onRemove={onRemove}
					/>
				</div>
				<Link to={`/article/${article.id}`}>
					<h2 className="text-lg font-bold line-clamp-1 hover:underline">
						{article.title}
					</h2>
				</Link>
			</CardHeader>

			<Separator className="my-3" />

			<CardContent className="pb-4">
				<p className="text-sm text-muted-foreground line-clamp-2">
					{article.description}
				</p>
			</CardContent>
			<CardFooter className="flex items-center justify-between text-xs text-muted-foreground pb-4">
				<span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
					<RiNewspaperLine /> {article.sourceName}
				</span>
				<span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
					<RiTimeLine /> {formattedDate}
				</span>
			</CardFooter>
		</Card>
	);
}
