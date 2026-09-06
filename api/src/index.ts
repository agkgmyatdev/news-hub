import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { router as articleRoutes } from "./routes/articleRoutes";
import { router as bookmarkRoutes } from "./routes/bookmarkRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { startCronJobs } from "./lib/cron";

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
	res.json({ message: "News API is running..." });
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`News API running at http://localhost:${PORT}`);
	startCronJobs();
});
