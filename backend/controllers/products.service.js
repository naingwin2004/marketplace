import Product from "../models/products.js";
import mongoose from "mongoose";
import cloudinary from "../middleware/cloudinary.js";

export const updateImage = async (req, res) => {
	const { id } = req.params;
	const cover = req.files?.["cover"]?.[0];
	const images = req.files?.["images"];

	try {
		const product = await Product.findById(id);
		if (!product) {
			return res.status(400).json({ message: "No product found" });
		}
		if (product.seller.toString() !== req.userId.toString()) {
			return res.status(400).json({ message: "is not your product" });
		}
		if (cover) {
			if (product.coverImage && product.coverImage.id) {
				await cloudinary.uploader.destroy(product.coverImage.id);
			}
			const uploadResponse = await cloudinary.uploader.upload(
				cover.path,
				{
					folder: "cover_images"
				}
			);
			console.log(uploadResponse);

			product.coverImage = {
				url: uploadResponse.secure_url,
				id: uploadResponse.public_id,
				name: uploadResponse.display_name
			};
		}
		if (images) {
			const uploadPromises = images.map(async img => {
				const uploadResponse = await cloudinary.uploader.upload(
					img.path,
					{
						folder: "array_images"
					}
				);

				return {
					url: uploadResponse.secure_url,
					id: uploadResponse.public_id,
					name: uploadResponse.display_name
				};
			});

			const newImages = await Promise.all(uploadPromises);
			product.arrayImages = [...product.arrayImages, ...newImages];
		}

		await product.save();
		return res
			.status(200)
			.json({ message: "updateImage success", id: product._id });
	} catch (err) {
		console.log("Error in updateImage :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getImages = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id);
		if (!product) {
			return res.status(400).json({ message: "No product found" });
		}
		if (product.seller.toString() !== req.userId.toString()) {
			return res.status(400).json({ message: "is not your product" });
		}
		return res.status(200).json({
			coverImage: product.coverImage,
			arrayImages: product.arrayImages,
			name: product.name
		});
	} catch (err) {
		console.log("Error in getImages :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getOldProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id);
		if (!product) {
			return res.status(400).json({ message: "No product found" });
		}
		return res.status(200).json(product);
	} catch (err) {
		console.log("Error in getOldProduct :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const deleteImage = async (req, res) => {
	const { imageId, productId } = req.query;

	if (!imageId || !productId) {
		return res.status(400).json({ message: "All field are required" });
	}
	try {
		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return res.status(400).json({ message: "Invalid productId 1" });
		}
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(400).json({ message: "No product found" });
		}
		if (product.seller.toString() !== req.userId.toString()) {
			return res.status(400).json({ message: "is not your product" });
		}
		await cloudinary.uploader.destroy(imageId);
		const filterProduct = product.arrayImages.filter(
			image => image.id !== imageId
		);
		product.arrayImages = filterProduct;
		await product.save();
		return res.status(200).json({ message: "deleteImage success" });
	} catch (err) {
		console.log("Error in deleteImage:", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateProduct = async (req, res) => {
	const { id, name, description, category, price, voucher, warranty } =
		req.body;

	try {
		const product = await Product.findById(id);

		if (!product) {
			return res.status(400).json({ message: "No product found" });
		}
		if (product.seller.toString() !== req.userId.toString()) {
			return res.status(400).json({ message: "is not your product" });
		}
		product.name = name;
		product.description = description;
		product.category = category;
		product.price = price;
		product.voucher = voucher;
		product.warranty = warranty;
		await product.save();

		return res.status(200).json({ message: "product updated" });
	} catch (err) {
		console.error("Error in updateProduct:", err);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
