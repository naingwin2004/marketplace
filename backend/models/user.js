import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		username: {
			type: String,
			required: true
		},
		avatar: {
			url: String,
			id: String,
			name: String
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user"
		},
		password: {
			type: String,
			minlength: 8
		},
		googleId: {
			type: String,
			unique: true,
			sparse: true // important for optional unique fields
		},
		status: {
			type: String,
			enum: ["banned", "active"],
			default: "active"
		},
		isVerified: {
			type: Boolean,
			default: false
		},
		bio: String,
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
