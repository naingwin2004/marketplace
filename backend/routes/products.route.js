import express from "express";

import {
	publicProducts,
	productDetails,
	addProduct,
	getProducts,
	deleteProduct,
} from "../controllers/products.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const productsRouter = express.Router();

productsRouter.get("/", authMiddleware, getProducts);
productsRouter.get("/publicProducts", publicProducts);
productsRouter.get("/:id", authMiddleware, productDetails);

productsRouter.post("/add", authMiddleware, addProduct);
productsRouter.delete("/:id", authMiddleware, deleteProduct);

export default productsRouter;
