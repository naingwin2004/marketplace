import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/GoogleIcon";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { useRegisterMutation } from "@/services/auth.js";
import { setCredentials } from "@/app/features/auth.js";

const registerSchema = z
	.object({
		username: z
			.string()
			.min(2, {
				message: "Username must be at least 2 characters.",
			})
			.max(20, {
				message: "Username must be at most 20 characters.",
			}),

		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		password: z
			.string()
			.min(8, {
				message: "Password must be at least 8 characters.",
			})
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

export default function RegisterPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [registerMutation, { isLoading, data, error }] =
		useRegisterMutation();

	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values) {
		// confirmPassword not send to server
		const { confirmPassword, ...data } = values;
		console.log(data);
		try {
			const res = await registerMutation(data).unwrap();
			dispatch(setCredentials(res));
			toast.success(res?.message);
			navigate("/verifyEmail", { replace: true });
		} catch (err) {
			console.log("Error in Register, onSubmit : ", err);
			toast.error(err?.data?.message || "Register error");
		}
	}

	function handleGoogleSignup() {
		console.log("Google signup clicked");
		// Handle Google signup logic here
	}

	return (
		<div className='h-full flex justify-center items-center'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						Create Account
					</CardTitle>
					<CardDescription className='text-center'>
						Enter your information to create your account
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
							<FormField
								control={form.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel>FullName</FormLabel>
										<FormControl>
											<Input
												type='text'
												placeholder='Enter your FullName'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type='email'
												placeholder='Enter your email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<div className='relative'>
												<Input
													type={
														showConfirmPassword
															? "text"
															: "password"
													}
													placeholder='Confirm your password'
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

							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<Separator className='w-full' />
								</div>
								<div className='relative flex justify-center text-xs uppercase'>
									<span className='bg-accent px-2 text-accent-foreground'>
										Or continue with
									</span>
								</div>
							</div>

							<Button
								variant='outline'
								className='w-full'
								onClick={handleGoogleSignup}
								type='button'>
								<GoogleIcon />
								Sign up with Google
							</Button>

							<Button
								type='submit'
								className='w-full'
								disabled={isLoading}>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"Create Account"
								)}
							</Button>
						</form>
					</Form>

					<div className=' text-sm flex justify-center items-center gap-1'>
						<CardDescription>
							Already have an account?
						</CardDescription>
						<Button
							variant='link'
							className='px-0'
							asChild>
							<Link to='/login'>Login</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
