import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	console.error(err);

	if (err instanceof AppError) {
		res.status(err.statusCode).json({ error: err.message });
		return;
	}

	res.status(500).json({ error: "Internal server error" });
}
