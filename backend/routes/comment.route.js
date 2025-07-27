import express from "express";

import { addComment, getComments,deleteComment } from "../controllers/comment.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const commentRouter = express.Router();

commentRouter.get("/", authMiddleware, getComments);

commentRouter.post("/add", authMiddleware, addComment);

commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;
