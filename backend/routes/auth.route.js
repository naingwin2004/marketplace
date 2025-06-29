import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import {
	register,
	login,
	logout,
	checkAuth,
} from "../controllers/authController.js";

import {
	verifyEmail,
	resendOtp,
	refreshToken,
	forgotPassword,
	resetPassword,
	changePassword
} from "../controllers/authService.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/register", register);
authRouter.post("/refreshToken", refreshToken);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/resetPassword/:token", resetPassword);
authRouter.post("/verifyEmail", authMiddleware, verifyEmail);
authRouter.post("/resendOtp", authMiddleware, resendOtp);
authRouter.post("/changePassword", authMiddleware, changePassword);

authRouter.get("/checkAuth", authMiddleware, checkAuth);

export default authRouter;
