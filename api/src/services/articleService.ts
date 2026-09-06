import { prisma } from "../lib/prisma";
import { Article } from "../../generated/prisma/client";
import { NewsArticle } from "../types/newsapi";
import { fetchTopHeadlines } from "./newsApiService";

export async function getAllArticles(category?: string): Promise<Article[]> {
	return await prisma.article.findMany({
		where: category ? { category } : undefined,
		orderBy: { publishedAt: "desc" },
	});
}

export async function getArticleById(id: string): Promise<Article | null> {
	return await prisma.article.findUnique({ where: { id } });
}

export async function upsertArticleFromNewsApi(
	article: NewsArticle,
	category: string,
): Promise<Article> {
	return await prisma.article.upsert({
		where: { externalId: article.url },
		update: {
			title: article.title,
			description: article.description || "",
			content: article.content || "",
			imageUrl: article.urlToImage,
		},
		create: {
			externalId: article.url,
			title: article.title,
			description: article.description || "",
			content: article.content || "",
			url: article.url,
			imageUrl: article.urlToImage,
			sourceName: article.source.name,
			sourceUrl: null,
			category,
			publishedAt: new Date(article.publishedAt),
		},
	});
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const CATEGORIES = ["general", "technology", "sports", "business", "health"];

export async function syncAllCategories(): Promise<
	{ category: string; synced: number; error?: string }[]
> {
	const results: { category: string; synced: number; error?: string }[] = [];

	for (const category of CATEGORIES) {
		try {
			const newsData = await fetchTopHeadlines(category);
			const upserted = await Promise.all(
				newsData.articles.map((article) =>
					upsertArticleFromNewsApi(article, category),
				),
			);
			results.push({ category, synced: upserted.length });
		} catch (error) {
			console.error(`Sync failed for category "${category}":`, error);
			results.push({
				category,
				synced: 0,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}

		await sleep(1500);
	}

	return results;
}

export async function cleanupOldArticles(daysOld: number = 7): Promise<number> {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - daysOld);

	const result = await prisma.article.deleteMany({
		where: {
			fetchedAt: { lt: cutoffDate },
			bookmarks: { none: {} },
		},
	});

	return result.count;
}
