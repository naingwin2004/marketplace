import Product from "../models/products.js";

export const getProducts = async (req, res) => {
	const { search, page = 1, status, category } = req.query;

	if (req.role !== "admin") {
		return res.status(400).json({ message: "Admin only" });
	}

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
			...filter
		});
		const totalPages = Math.ceil(totalProducts / limit);
		const validPage = Math.max(1, Math.min(page, totalPages));

		const products = await Product.find({ ...filter })
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
			totalProducts
		});
	} catch (err) {
		console.log("Error in getProducts :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateProductStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (req.role !== "admin") {
			return res.status(400).json({ message: "Admin only" });
		}

		const product = await Product.findById(id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		product.status = status;
		await product.save();

		res.status(200).json({ message: "Product status updated", product });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
