import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { CreateBookmarkSchema } from "../schemas/bookmarkSchema";
import {
	createBookmark,
	deleteBookmark,
	listBookmarks,
} from "../controllers/bookmarkController";

export const router = Router();

router.use(requireAuth);

router.get("/", listBookmarks);
router.post("/", validate(CreateBookmarkSchema), createBookmark);
router.delete("/:articleId", deleteBookmark);
