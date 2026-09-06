import { Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client";
import { AuthRequest } from "../middleware/requireAuth";
import {
	addBookmark,
	removeBookmark,
	getUserBookmarks,
} from "../services/bookmarkService";
import { CreateBookmarkInput } from "../schemas/bookmarkSchema";

export async function createBookmark(
	req: AuthRequest & { body: CreateBookmarkInput },
	res: Response,
	next: NextFunction,
) {
	try {
		const { articleId } = req.body;
		const bookmark = await addBookmark(req.userId!, articleId);
		res.status(201).json(bookmark);
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			res.status(200).json({ message: "Already bookmarked" });
			return;
		}
		next(error);
	}
}

export async function deleteBookmark(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const { articleId } = req.params;
		await removeBookmark(req.userId!, articleId as string);
		res.status(204).send();
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			res.status(200).json({ message: "Already removed" });
			return;
		}
		next(error);
	}
}

export async function listBookmarks(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const bookmarks = await getUserBookmarks(req.userId!);
		res.json(bookmarks);
	} catch (error) {
		next(error);
	}
}
