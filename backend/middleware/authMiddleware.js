import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No token provided" });
		}

		const token = authHeader.split(" ")[1];

		// verify the JWT using our secret key.
		const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

		req.userId = decoded.userId;
		req.role = decoded.role;
		next();
	} catch (err) {
		console.log("Error in authMiddleware:", err.message);
		if (err.name === "JsonWebTokenError" ) {
			return res.status(403).json({ message: "Invalid Token" });
		}
		if (err.name === "TokenExpiredError") {
			return res.status(403).json({ message: "TokenExpired" });
		}
		return res.status(403).json({ message: "Unauthorized: Invalid token" });
	}
};
