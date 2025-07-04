import express from "express";

import { publicProducts } from "../controllers/products.controller.js";

const productsRouter = express.Router();

productsRouter.get("/", publicProducts);

export default productsRouter;
