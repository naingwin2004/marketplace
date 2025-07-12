import express from "express";

import {
	publicProducts,
	productDetails,
	addProduct,
	getProducts,
} from "../controllers/products.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const productsRouter = express.Router();

productsRouter.get("/", authMiddleware, getProducts);
productsRouter.get("/publicProducts", publicProducts);
productsRouter.get("/:id", authMiddleware, productDetails);

productsRouter.post("/add", authMiddleware, addProduct);

export default productsRouter;
