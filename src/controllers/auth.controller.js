import bcrypt from "bcryptjs";

import User from "../models/user.js";
import {
	generateAccessToken,
	generateRefreshTokenAndSetCookie,
} from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/nodemailer.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Check if any required fields are missing
		if (!username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if a user already exists with the provided email
		const isUserExisted = await User.findOne({ email });

		// If user exists, return an error
		if (isUserExisted) {
			return res.status(409).json({ message: "User already exists" });
		}

		//  Hash the password using bcrypt for security
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate a random OTP (6-digit)
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Hash the OTP using bcrypt for security
		const hashedOtp = await bcrypt.hash(otp, 10);

		// Create a new user in the database
		const user = await User.create({
			username,
			email,
			password: hashedPassword, // Store the hashed password
			verificationToken: hashedOtp, // Store the hashed OTP for email verification
			verificationTokenExpiresAt: Date.now() + 60 * 1000, // Set expiration time for OTP (15 minutes)
		});

		// Save the user in the database
		await user.save();

		// Generate  token for  API requests.
		const token = await generateAccessToken({
			userId: user._id,
			role: user.role,
		});

		await generateRefreshTokenAndSetCookie(res, {
			userId: user._id,
			role: user.role,
		});

		// Email sending
		const info = await sendVerificationEmail(res, email, otp);
		console.log("Email sent:", info.response);

		return res.status(201).json({
			message: "User Created Successfully",
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				role: user.role,
				status: user.status,
				isVerified: user.isVerified,
			},
			token,
		});
	} catch (err) {
		console.log("Error in register :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// Check if any required fields are missing
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if a user exists with the provided email
		const user = await User.findOne({ email });

		// If user not exists, return an error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if a password is valid
		const isValidPassword = await bcrypt.compare(password, user.password);

		// if password is not match, return error
		if (!isValidPassword) {
			return res.status(401).json({ message: "Invalid credential" });
		}

		// Generate  token for  API requests.
		const token = await generateAccessToken({
			userId: user._id,
			role: user.role,
		});

		return res.status(200).json({
			message: "login successfully",
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				role: user.role,
				status: user.status,
				isVerified: user.isVerified,
			},
			token,
		});
	} catch (err) {
		console.log("Error in login :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

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
		if (!email || !otp) {
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
		user.verificationTokenExpiresAt = Date.now() + 60 * 1000; // Set expiration time for OTP (15 minutes)
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

export const checkAuth = async (req, res) => {
	// come from auth middleware
	const userId = req.userId;
	try {
		// Check if a user exists with the provided userId
		const user = await User.findById(userId);

		// If user not exists, return an error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({
			message: "User authenticated",
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				role: user.role,
				status: user.status,
				isVerified: user.isVerified,
			},
		});
	} catch (err) {
		console.log("Error in checkAuth :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("refreshToken");
	return res.status(200).json({ message: "logout successfully" });
};
