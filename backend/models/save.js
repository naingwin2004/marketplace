import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Product"
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User"
	}
});

const Save = mongoose.model("Save", saveSchema);

export default Save;
