import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	InputOTPSeparator,
} from "@/components/ui/input-otp";

import {
	useResendOtpMutation,
	useVerifyEmailMutation,
} from "@/services/auth.js";
import { updateUser } from "@/app/features/auth.js";

const otpSchema = z.object({
	otp: z
		.string()
		.nonempty({ message: "OTP is required." })
		.length(6, { message: "OTP must be exactly 6 characters." }),
});

const OTPVerification = () => {
	const naviage = useNavigate();
	const dispatch = useDispatch();
	const email = useSelector((state) => state.auth?.user?.email);
	const [resendMutation, { isLoading: resendLoading }] =
		useResendOtpMutation();
	const [verifyEmailMutation, { isLoading }] = useVerifyEmailMutation();

	const form = useForm({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			otp: "",
		},
	});

	async function onSubmit(values) {
		// Handle login logic here
		const payloads = { ...values, email };
		try {
			const res = await verifyEmailMutation(payloads).unwrap();
			toast.success(res?.message);
			dispatch(updateUser({ isVerified: true }));
			naviage("/");
		} catch (err) {
			console.log("Error in OTPVerification, fn=> onSubmit", err);
			toast.error(err?.data?.message || "Failer");
		}
	}

	async function handleResend() {
		// Handle login logic here
		try {
			const res = await resendMutation({ email }).unwrap();
			toast.success(res?.message);
			naviage("/verifyEmail");
		} catch (err) {
			console.log("Error in OTPVerification, fn=> handleResend", err);
			toast.error(err?.data?.message || "Failer");
		}
	}

	return (
		<div className='h-full flex flex-col justify-center items-center space-y-4'>
			<div>{resendLoading && "Sending OTP ..."}</div>

			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						Verify Your Email
					</CardTitle>
					<CardDescription className='text-center'>
						We've sent a 6-digit code to your email
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
							<FormField
								control={form.control}
								name='otp'
								render={({ field }) => (
									<FormItem className='flex flex-col justify-center items-center'>
										<FormLabel>One-Time Password</FormLabel>
										<FormControl>
											<InputOTP
												maxLength={6}
												{...field}>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<CardDescription>
											Enter your one-time password
										</CardDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type='submit'
								className='w-full'
								disabled={isLoading}>
								Submit
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className='flex justify-center items-center'>
					<CardDescription>
						Didn't receive a code?{" "}
						<Button
							variant='link'
							className='p-0 h-auto'
							disabled={resendLoading}
							onClick={handleResend}>
							Resend
						</Button>
					</CardDescription>
				</CardFooter>
			</Card>
		</div>
	);
};

export default OTPVerification;
