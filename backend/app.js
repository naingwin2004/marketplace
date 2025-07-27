import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import productsRouter from "./routes/products.route.js";
import commentRouter from "./routes/comment.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	}),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/comments", commentRouter);

export default app;
