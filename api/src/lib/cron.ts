import cron from "node-cron";
import { syncAllCategories } from "../services/articleService";

export function startCronJobs(): void {
	cron.schedule("0 */2 * * *", async () => {
		console.log("Running scheduled news sync...");
		try {
			const results = await syncAllCategories();
			console.log("Sync complete:", results);

			const failed = results.filter((r) => r.error);
			if (failed.length > 0) {
				console.warn(
					`${failed.length} categories failed:`,
					failed.map((f) => f.category),
				);
			}
		} catch (error) {
			console.error("Scheduled sync failed:", error);
		}
	});

	cron.schedule("0 3 * * *", async () => {
		console.log("Running scheduled article cleanup...");
		try {
			const { cleanupOldArticles } =
				await import("../services/articleService");
			const deletedCount = await cleanupOldArticles(7);
			console.log(
				`Cleanup complete: ${deletedCount} old articles removed`,
			);
		} catch (error) {
			console.error("Scheduled cleanup failed:", error);
		}
	});
}
