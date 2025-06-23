import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "naingwin.dev@gmail.com",
		pass: process.env.MAIL_PASS,
	},
});

export const sendVerificationEmail = async (res, email, otp) => {
	try {
		const info = await transporter.sendMail({
			from: "naingwin.dev@gmail.com",
			to: email,
			subject: `Verify Your Email`,
			text: otp,
		});
		return info
	} catch (error) {
		console.log("Error sending verification email", error);
		return res.status(400).json({
			message: "Error sending verification email",
			error: error.message,
		});
	}
};

async function sendEmail(mailOptions) {
	return transporter.sendMail(mailOptions);
}

export default sendEmail;
