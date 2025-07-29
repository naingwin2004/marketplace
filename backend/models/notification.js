
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // who triggered the notification (e.g., commenter)
			required: true
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // who receives the notification
			required: true
		},
		commentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment", // related comment
			required: true
		},
		isRead: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model("Notification", notificationSchema);
