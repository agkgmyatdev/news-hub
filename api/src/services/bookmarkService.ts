import { prisma } from "../lib/prisma";

export async function addBookmark(userId: string, articleId: string) {
	return prisma.bookmark.create({
		data: { userId, articleId },
	});
}

export async function removeBookmark(userId: string, articleId: string) {
	return prisma.bookmark.delete({
		where: {
			userId_articleId: { userId, articleId },
		},
	});
}

export async function getUserBookmarks(userId: string) {
	return prisma.bookmark.findMany({
		where: { userId },
		include: { article: true },
	});
}
