import mongoose from "mongoose";
import Comment from "../models/comment.js";
import Product from "../models/products.js";
import Notification from "../models/notification.js";

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

		await Notification.create({
			from: userId,
			to: product.seller,
			commentId: comment._id
		});

		return res.status(201).json({ message: "Comment created" });
	} catch (err) {
		console.log("Error in addComment:", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getComments = async (req, res) => {
	const { productId } = req.query;

	try {
		const comments = await Comment.find({ productId })
			.sort({ createdAt: -1 })
			.populate("userId", "username avatar");

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

export const getNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ to: req.userId })
			.sort({ createdAt: -1 })
			.populate("from", "username avatar")
			.populate("commentId", "content createdAt productId");

		res.status(200).json(notifications);
	} catch (err) {
		console.log("Error in getNotifications:", err.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const notificationRead = async (req, res) => {
	const { id } = req.body;
	const userId = req.user._id;

	try {
		const notification = await Notification.findById(id);

		if (!notification) {
			return res.status(404).json({ message: "Notification not found" });
		}

		if (notification.to.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({
					message:
						"You are not authorized to update this notification"
				});
		}

		notification.isRead = true;
		await notification.save();

		return res.status(200).json(notification);
	} catch (err) {
		console.log("Error in notificationRead:", err.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
