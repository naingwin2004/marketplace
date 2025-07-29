import express from "express";

import {
	addComment,
	getComments,
	deleteComment,
	getNotifications
} from "../controllers/comment.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const commentRouter = express.Router();

commentRouter.get("/", authMiddleware, getComments);
commentRouter.get("/notifications", authMiddleware, getNotifications);

commentRouter.post("/add", authMiddleware, addComment);

commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;
