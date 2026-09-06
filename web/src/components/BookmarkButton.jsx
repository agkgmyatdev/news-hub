import { useState } from "react";
import { RiBookmarkFill, RiBookmarkLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function BookmarkButton({
	articleId,
	initialBookmarked = false,
	onRemove,
}) {
	const [bookmarked, setBookmarked] = useState(initialBookmarked);
	const [loading, setLoading] = useState(false);

	async function toggleBookmark() {
		setLoading(true);

		const url = bookmarked
			? `${API_BASE}/bookmarks/${articleId}`
			: `${API_BASE}/bookmarks`;

		const method = bookmarked ? "DELETE" : "POST";

		const res = await fetch(url, {
			method,
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: bookmarked ? undefined : JSON.stringify({ articleId }),
		});

		if (res.status === 401) {
			toast.error("Please log in to bookmark articles");
			setLoading(false);
			return;
		}

		if (res.ok) {
			const wasBookmarked = bookmarked;
			setBookmarked(!bookmarked);
			toast.success(
				wasBookmarked ? "Bookmark removed" : "Article bookmarked",
			);

			if (wasBookmarked && onRemove) {
				onRemove(articleId);
			}
		} else {
			toast.error("Something went wrong. Please try again.");
		}

		setLoading(false);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleBookmark}
			disabled={loading}
			className="h-8 w-8">
			{bookmarked ? (
				<RiBookmarkFill className="text-blue-600" />
			) : (
				<RiBookmarkLine />
			)}
		</Button>
	);
}
