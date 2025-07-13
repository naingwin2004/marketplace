import mongoose from "mongoose";

import Product from "../models/products.js";

export const publicProducts = async (req, res) => {
	try {
		const { page = 1, search, sortby = "newest", category } = req.query;

		let filter = {
			status: "active",
		};

		if (category) {
			filter.category = category;
		}

		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		let sort;
		if (sortby === "newest") sort = { createdAt: -1 };
		if (sortby === "oldest") sort = { createdAt: 1 };
		if (sortby === "price-low") sort = { price: 1 };
		if (sortby === "price-high") sort = { price: -1 };

		let limit = 9;

		const totalProducts = await Product.countDocuments(filter);
		const totalPages = Math.ceil(totalProducts / limit);

		const validPage = Math.max(1, Math.min(page, totalPages));

		const products = await Product.find(filter)
			.sort(sort)
			.skip((validPage - 1) * limit)
			.limit(limit);

		const selectedProducts = products.map((product) => ({
			_id: product._id,
			name: product.name,
			description: product.description,
			category: product.category,
			price: product.price,
			coverImage: product.coverImage,
			createdAt: product.createdAt,
		}));

		return res.status(200).json({
			products: selectedProducts,
			totalProducts,
			currentPage: validPage,
			totalPages,
		});
	} catch (err) {
		console.log("Error in publicProducts :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const productDetails = async (req, res) => {
	const { id } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				message: " Invalid product ID",
			});
		}
		const product = await Product.findById(id).populate(
			"seller",
			"_id username avatar email role bio",
		);

		if (!product) {
			return res.status(404).json({ message: "Product Not Found" });
		}

		return res.status(200).json(product);
	} catch (err) {
		console.log("Error in productDetails :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const addProduct = async (req, res) => {
	const { name, description, category, price, warranty, voucher } = req.body;

	try {
		const product = await Product.create({
			name,
			description,
			category,
			price,
			warranty,
			voucher,
			seller: req.userId,
		});
		await product.save();

		return res.status(201).json({
			message: "product created",
		});
	} catch (err) {
		console.log("Error in addProduct :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getProducts = async (req, res) => {
	const { search, page = 1, status, category } = req.query;
	try {
		let limit = 10;

		let filter = {};
		if (search) {
			filter.name = { $regex: search, $options: "i" };
		}
		if (status) {
			filter.status = status;
		}
		if (category) {
			filter.category = category;
		}

		const totalProducts = await Product.countDocuments({
			seller: req.userId,
			...filter,
		});
		const totalPages = Math.ceil(totalProducts / limit);
		const validPage = Math.max(1, Math.min(page, totalPages));

		const products = await Product.find({ seller: req.userId, ...filter })
			.sort({ createdAt: -1 })
			.skip((validPage - 1) * limit)
			.limit(limit);
		if (!products) {
			return res.status(404).json({ message: "No products" });
		}

		return res.status(200).json({
			products,
			totalPages,
			currentPage: validPage,
			totalProducts,
		});
	} catch (err) {
		console.log("Error in getProducts :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		if (product.seller.toString() !== req.userId.toString()) {
			return res
				.status(400)
				.json({ message: "This is not your product" });
		}
		await product.deleteOne();
		return res
			.status(200)
			.json({ message: "Product deleted successfully" });
	} catch (err) {
		console.log("Error in deleteProduct :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
