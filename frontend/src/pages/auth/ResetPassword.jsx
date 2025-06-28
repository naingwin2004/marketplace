import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Button } from "../../components/ui/button.jsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";

import { useResetPasswordMutation } from "@/services/auth.js";

const confirmPasswordFormSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[a-zA-Z]/, {
				message: "Password must contain at least one letter.",
			})
			.regex(/[0-9]/, {
				message: "Password must contain at least one number.",
			})
			.regex(/[^a-zA-Z0-9]/, {
				message:
					"Password must contain at least one special character.",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const ResetPassword = () => {
	const { token } = useParams();
	const navigate = useNavigate();

	const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm({
		resolver: zodResolver(confirmPasswordFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values) {
		console.log(values);
		try {
			const res = await resetPasswordMutation({
				token,
				values,
			}).unwrap();
			toast.success(res?.message);
			navigate("/login", { replace: true });
		} catch (err) {
			console.log("Error in ResetPassword, onSubmit : ", err);
			toast.error(err?.message || err?.data?.message || "Failer");
		}
	}

	return (
		<div className='h-full flex justify-center items-center'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>ResetPassword</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className='relative'>
												<Input
													type={
														showPassword
															? "text"
															: "password"
													}
													placeholder='Create a password'
													{...field}
												/>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
													onClick={() =>
														setShowPassword(
															!showPassword,
														)
													}>
													{showPassword ? (
														<EyeOff className='h-4 w-4 text-muted-foreground' />
													) : (
														<Eye className='h-4 w-4 text-muted-foreground' />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>ConfirmPassword</FormLabel>
										<FormControl>
											<div className='relative'>
												<Input
													type={
														showConfirmPassword
															? "text"
															: "password"
													}
													placeholder='Confirm a password'
													{...field}
												/>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword,
														)
													}>
													{showConfirmPassword ? (
														<EyeOff className='h-4 w-4 text-muted-foreground' />
													) : (
														<Eye className='h-4 w-4 text-muted-foreground' />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type='submit'
								className='w-full'
								disabled={isLoading}>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"ResetPassword"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPassword;
