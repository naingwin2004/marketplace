import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import {
	register,
	login,
	verifyEmail,
	logout,
	checkAuth,
	resendOtp
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/register", register);
authRouter.post("/verifyEmail", authMiddleware, verifyEmail);
authRouter.post("/resendOtp", authMiddleware, resendOtp);

authRouter.get("/checkAuth", authMiddleware, checkAuth);

export default authRouter;
