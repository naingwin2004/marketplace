import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
	
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(
			null,
			`${Date.now()}-${Math.round(Math.random() * 1e9)}-${
				file.fieldname
			}${ext}`,
		);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Only image files allowed"), false);
	}
};

export const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const avatarUploadMiddleware = (req, res, next) => {
	upload.single("avatar")(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return res
					.status(400)
					.json({ message: "File is too large. Max size is 5MB." });
			}
			return res.status(400).json({ message: err.message });
		} else if (err) {
			console.log("Error in multer :", err.message);
			return res.status(500).json({ message: "File upload failed." });
		}
		next();
	});
};
