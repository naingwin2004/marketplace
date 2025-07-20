import express from "express";

import {
	publicProducts,
	productDetails,
	addProduct,
	getProducts,
	deleteProduct
} from "../controllers/products.controller.js";

import {
	updateImage,
	getImages,
	deleteImage,
	getOldProduct,
	updateProduct,
	saveProduct,
	getSaveProduct,
	unSave
} from "../controllers/products.service.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { upload } from "../middleware/multer.js";

const productsRouter = express.Router();

productsRouter.get("/", authMiddleware, getProducts);
productsRouter.get("/publicProducts", publicProducts);
productsRouter.get("/getSave", authMiddleware, getSaveProduct);
productsRouter.get("/images/:id", authMiddleware, getImages);
productsRouter.get("/:id", authMiddleware, productDetails);
productsRouter.get("/oldProduct/:id", authMiddleware, getOldProduct);

productsRouter.post("/add", authMiddleware, addProduct);
productsRouter.post("/save", authMiddleware, saveProduct);
productsRouter.post("/update", authMiddleware, updateProduct);
productsRouter.post(
	"/:id",
	upload.fields([
		{ name: "cover", maxCount: 1 },
		{ name: "images", maxCount: 4 }
	]),
	authMiddleware,
	updateImage
);

productsRouter.delete("/delete-image", authMiddleware, deleteImage);
productsRouter.delete("/unSave", authMiddleware, unSave);
productsRouter.delete("/:id", authMiddleware, deleteProduct);

export default productsRouter;
