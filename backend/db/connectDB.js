import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB connectes : ${conn.connection.host}`);
	} catch (err) {
	  console.log("MongoDB connection error : ", err.message);
		process.exit(1)
	}
};
