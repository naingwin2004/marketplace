import * as z from "zod";
import { useForm } from "react-hook-form";
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

const otpSchema = z.object({
	otp: z
		.string()
		.nonempty({ message: "OTP is required." })
		.length(6, { message: "OTP must be exactly 6 characters." }),
});

const OTPVerification = () => {
	const form = useForm({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			otp: "",
		},
	});

	function onSubmit(values) {
		console.log(values);
		// Handle login logic here
	}

	function handleResend() {
		console.log("resend");
		// Handle login logic here
	}

	function handleOtp() {
		console.log("otp");
		// Handle login logic here
	}

	return (
		<div className='h-full flex justify-center items-center'>
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
								onClick={handleOtp}>
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
