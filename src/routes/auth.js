import express from "express";

import {
	register,
	login,
	verifyEmail,
	logout,
	checkAuth,
} from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/register", register);
authRouter.post("/checkAuth", checkAuth);
authRouter.post("/verifyEmail", verifyEmail);

export default authRouter;
