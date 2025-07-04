import mongoose from "mongoose"

const imageSchema = new mongoose.Schema(
	{
		url: String,
		public_id: String,
	},
	{ _id: false },
);

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		category: {
			type: String,
			required: true,
			enum: [
				"electronics",
				"clothing",
				"home",
				"sports",
				"toys",
				"beauty",
				"books",
			],
		},
		price: { type: Number, required: true },
		voucher: { type: Boolean, default: false },
		warranty: { type: Boolean, default: false },
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "active","reject"],
			default: "pending",
		},
		coverImage: imageSchema,
		arrayImages: [imageSchema],
	},
	{ timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
