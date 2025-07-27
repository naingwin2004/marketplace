import mongoose from "mongoose";
import Comment from "../models/comment.js";
import Product from "../models/products.js";

// Add Comment
export const addComment = async (req, res) => {
	const { productId, content } = req.body;

	const userId = req.userId;

	try {
		const product = await Product.findById(productId);

		if (product.seller.toString() === userId.toString()) {
			return res
				.status(400)
				.json({ message: "You can't comment on your own product" });
		}

		const comment = await Comment.create({
			productId,
			userId,
			content
		});
		await comment.save();

		return res.status(201).json({ message: "Comment created" });
	} catch (err) {
		console.log("Error in addComment:", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get Comments for a specific product
export const getComments = async (req, res) => {
	const { productId } = req.query;

	try {
		const comments = await Comment.find({ productId })
			.sort({ createdAt: -1 })
			.populate("userId", "username");

		if (!comments || comments.length === 0) {
			return res.status(404).json({ message: "No comments Yet" });
		}

		return res.status(200).json(comments);
	} catch (err) {
		console.log("Error in getComments:", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};


export const deleteComment = async (req, res) => {
	const { commentId } = req.params;

	try {

		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}


		if (comment.userId.toString() !== req.userId.toString()) {
			return res
				.status(403)
				.json({ message: "You can only delete your own comment" });
		}


		await comment.deleteOne();

		return res
			.status(200)
			.json({ message: "Comment deleted successfully" });
	} catch (err) {
		console.log("Error in deleteComment:", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
