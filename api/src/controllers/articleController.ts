import { Request, Response, NextFunction } from "express";
import { getAllArticles, getArticleById } from "../services/articleService";
import { fetchTopHeadlines } from "../services/newsApiService";
import { AppError } from "../lib/AppError";

export async function listArticles(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const category = req.query.category as string | undefined;
		const articles = await getAllArticles(category);
		res.json(articles);
	} catch (error) {
		next(error);
	}
}

export async function getArticle(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { id } = req.params;
		const article = await getArticleById(id as string);

		if (!article) {
			throw new AppError("Article not found", 404);
		}

		res.json(article);
	} catch (error) {
		next(error);
	}
}

export async function syncArticles(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const category = (req.query.category as string) || "general";
		const newsData = await fetchTopHeadlines(category);
		res.json({ synced: newsData.articles.length });
	} catch (error) {
		next(error);
	}
}
