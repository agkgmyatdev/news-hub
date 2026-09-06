import { z } from "zod";
import { NewsApiResponseSchema, NewsApiResponse } from "../types/newsapi";

export async function fetchTopHeadlines(
	category: string = "general",
): Promise<NewsApiResponse> {
	const url = `${process.env.NEWSAPI_BASE_URL}/top-headlines?category=${category}&country=us&pageSize=5&apiKey=${process.env.NEWSAPI_SECRET}`;

	const response = await fetch(url);

	if (!response.ok) {
		const errorBody = await response.text();
		console.error("newsapi.org error response body:", errorBody);
		throw new Error(`newsapi.org error: ${response.status}`);
	}

	const rawData = await response.json();

	const result = NewsApiResponseSchema.safeParse(rawData);

	if (!result.success) {
		console.error(
			"newsapi.org response validation failed:",
			z.prettifyError(result.error),
		);
		throw new Error("newsapi.org returned unexpected data shape");
	}

	return result.data;
}
