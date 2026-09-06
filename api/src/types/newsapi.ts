import { z } from "zod";

export const NewsArticleSchema = z.object({
	source: z.object({
		id: z.string().nullable(),
		name: z.string(),
	}),
	title: z.string(),
	description: z.string().nullable(),
	url: z.url(),
	urlToImage: z.url().nullable(),
	publishedAt: z.string(),
	content: z.string().nullable(),
});

export const NewsApiResponseSchema = z.object({
	status: z.string(),
	totalResults: z.number(),
	articles: z.array(NewsArticleSchema),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type NewsApiResponse = z.infer<typeof NewsApiResponseSchema>;
