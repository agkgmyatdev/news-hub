import { z } from "zod";

export const CreateBookmarkSchema = z.object({
	articleId: z.string().min(1, "articleId is required"),
});

export type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;
