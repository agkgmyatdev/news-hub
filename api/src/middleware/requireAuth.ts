import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export interface AuthRequest extends Request {
	userId?: string;
}

export async function requireAuth(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});

	if (!session) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	req.userId = session.user.id;
	next();
}
