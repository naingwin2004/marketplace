import Product from "../models/products.js";

export const publicProducts = async (req, res) => {
	try {
		const { page = 1 } = req.query;
		let filter = {
			status: "active",
		};

		let sort = { createdAt: -1 };
		let limit = 9;

		const totalProducts = await Product.countDocuments(filter);
		const totalPages = Math.ceil(totalProducts / limit);

		const validPage = Math.min(page, totalPages);

		const products = await Product.find(filter)
			.sort({ createdAt: -1 })
			.skip((validPage - 1) * limit)
			.limit(limit);
			
			const selectedProducts = products.map((product) => ({
  _id: product._id,
  name: product.name,
  description: product.description,
  category: product.category,
  price: product.price,
  coverImage: product.coverImage,
}));



		return res.status(200).json({
			products:selectedProducts,
			totalProducts,
			currentPage: validPage,
			totalPages,
		});
	} catch (err) {
		console.log("Error in publicProducts :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
