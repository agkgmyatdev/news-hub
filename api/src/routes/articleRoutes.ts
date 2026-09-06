import { Router } from "express";
import {
	listArticles,
	getArticle,
	syncArticles,
} from "../controllers/articleController";

export const router = Router();

router.get("/", listArticles);
router.get("/sync", syncArticles);
router.get("/:id", getArticle);
