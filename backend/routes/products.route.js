import express from "express";

import {
	publicProducts,
	productDetails,
} from "../controllers/products.controller.js";

const productsRouter = express.Router();

productsRouter.get("/", publicProducts);
productsRouter.get("/:id", productDetails);

export default productsRouter;
