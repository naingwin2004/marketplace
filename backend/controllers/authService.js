import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // from node

import User from "../models/user.js";
import { generateAccessToken } from "../utils/jwt.js";

import {
	sendVerificationEmail,
	sendResetPassword,
} from "../utils/nodemailer.js";

export const verifyEmail = async (req, res) => {
	const { email, otp } = req.body;
	try {
		// Check if any required fields are missing
		if (!email || !otp) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if a user exists with the provided email
		const user = await User.findOne({ email });

		// If user not exists, return an error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if a Otp is valid
		const isValidOtp = await bcrypt.compare(otp, user.verificationToken);

		// if password is not match, return error
		if (!isValidOtp) {
			return res.status(401).json({ message: "Invalid OTP" });
		}

		// if expired time, return error
		if (user.verificationTokenExpiresAt < Date.now()) {
			return res.status(401).json({
				message: "Expired verification code, Try resend code",
			});
		}

		// Clear token and time
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;

		// Save the user in the database
		await user.save();

		return res.status(200).json({
			message: "Email Verify Successfully",
		});
	} catch (err) {
		console.log("Error in verifyEmail :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const resendOtp = async (req, res) => {
	const { email } = req.body;
	try {
		// Check if any required fields are missing
		if (!email) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if a user exists with the provided email
		const user = await User.findOne({ email });

		// If user not exists, return an error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// if already verify, return error
		if (user.isVerified) {
			return res.status(400).json({
				message: "Somthing wrong?",
			});
		}

		// if no Expired time, return error
		if (user.verificationTokenExpiresAt > Date.now()) {
			return res.status(400).json({
				message:
					"Verification code is not Expired, please check your email",
			});
		}

		// Generate a random OTP (6-digit)
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Hash the OTP using bcrypt for security
		const hashedOtp = await bcrypt.hash(otp, 10);

		user.verificationToken = hashedOtp; // Store the hashed OTP for email verification
		user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // Set expiration time for OTP (15 minutes)
		await user.save();

		// Email sending
		const info = await sendVerificationEmail(res, email, otp);
		console.log("Email sent:", info.response);

		return res.status(200).json({
			message: "OTP has been resent to your email",
		});
	} catch (err) {
		console.log("Error in resendOtp :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const refreshToken = async (req, res) => {
	const token = req.cookies.refreshToken;

	try {
		if (!token) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No token provided" });
		}

		const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

		const newAccessToken = await generateAccessToken({
			userId: decoded.userId,
			role: decoded.role,
		});

		return res.status(201).json({ newAccessToken });
	} catch (err) {
		console.log("Error in refreshToken:", err.message);

		if (
			err.name === "JsonWebTokenError" ||
			err.name === "TokenExpiredError"
		) {
			return res
				.status(403)
				.json({ message: "Invalid or expired token" });
		}

		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		if (!email) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: "User doesn't exists",
			});
		}

		if (user?.resetPasswordExpiresAt > Date.now()) {
			return res.status(400).json({
				message:
					"A reset link has already been sent. Please check your email.",
			});
		}

		const resetPasswordToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = crypto
			.createHash("sha256")
			.update(resetPasswordToken)
			.digest("hex");

		user.resetPasswordToken = hashedToken;
		user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; // 1h

		await user.save();

		await sendResetPassword(res, resetPasswordToken, email);

		return res.status(201).json({
			message: "We've sent the password reset link to your email",
		});
	} catch (err) {
		console.log("Error in forgotPassword :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password, confirmPassword } = req.body;

	try {
		if (!token || !password) {
			return res
				.status(400)
				.json({ message: "Token and password required" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords don't match" });
		}

		// Hash the token to match the DB value
		const hashedToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid or expired token" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;

		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;

		await user.save();

		return res.status(200).json({ message: "Password reset successful" });
	} catch (error) {
		console.error("Reset password error:", error.message);
		return res.status(500).json({ message: "Server error" });
	}
};

export const changePassword = async (req, res) => {
	const { email, password, newPassword } = req.body;

	try {
		if (!email || !password || !newPassword) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: "User doesn't exists",
			});
		}
		const isMatchPassword = await bcrypt.compare(password, user.password);
		if (!isMatchPassword) {
			return res.status(400).json({
				message: "incorrect password",
			});
		}

		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		const isMatchNewPassword = await bcrypt.compare(
			hashedNewPassword,
			user.password,
		);
		if (!isMatchNewPassword) {
			return res.status(400).json({
				message: "New password cannot be the same as the old password.",
			});
		}

		user.password = hashedNewPassword;
		await user.save();
		return res.status(200).json({
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error("Change password error:", error.message);
		return res.status(500).json({ message: "Server error" });
	}
};
