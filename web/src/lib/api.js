const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${BASE_URL}/api`;

export async function getArticles(category) {
	const url = category
		? `${API_BASE}/articles?category=${category}`
		: `${API_BASE}/articles`;

	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch articles");
	return res.json();
}

export async function getArticleById(id) {
	const res = await fetch(`${API_BASE}/articles/${id}`);
	if (!res.ok) throw new Error("Failed to fetch article");
	return res.json();
}

export async function getMyBookmarks() {
	const res = await fetch(`${API_BASE}/bookmarks`, {
		credentials: "include",
	});

	if (!res.ok) {
		if (res.status === 401) return [];
		throw new Error("Failed to fetch bookmarks");
	}

	return res.json();
}
