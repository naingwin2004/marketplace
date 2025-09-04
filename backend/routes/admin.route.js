import express from "express";

import {
	getProducts,
	updateProductStatus,
	getUsers,
	statusChangeUsers
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.get("/products", authMiddleware, getProducts);


adminRouter
  .route("/users")
  .get(authMiddleware, getUsers)
  .post(authMiddleware, statusChangeUsers);

adminRouter.put("/product/:id", authMiddleware, updateProductStatus);

export default adminRouter;
