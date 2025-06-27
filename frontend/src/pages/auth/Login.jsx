import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";

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

import { useLoginMutation } from "../../services/auth.js";
import { setCredentials } from "../../app/features/auth.js";

const loginSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().nonempty({
		message: "Password is required.",
	}),
});

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [login, { data, isLoading }] = useLoginMutation();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values) {
		try {
			const res = await login(values).unwrap();
			dispatch(setCredentials(res));
			toast.success(res?.message);
			navigate("/", { replace: true });
		} catch (err) {
			console.log("Error in Login, onSubmit : ", err);
			toast.error(err?.message || err?.data?.message || "Login error");
		}
	}

	function handleGoogleLogin() {
		console.log("Google login clicked");
		// Handle Google login logic here
	}

	return (
		<div className='h-full flex justify-center items-center'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						Login
					</CardTitle>
					<CardDescription className='text-center'>
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
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
													placeholder='Enter your password'
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
								onClick={handleGoogleLogin}
								type='button'>
								<GoogleIcon />
								Continue with Google
							</Button>

							<Button
								variant='link'
								className='px-0 text-sm'
								asChild>
								<Link to='/forgot-password'>
									Forgot password?
								</Link>
							</Button>

							<Button
								type='submit'
								className='w-full'
								disabled={isLoading}>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"Login"
								)}
							</Button>
						</form>
					</Form>

					<div className='text-sm flex justify-center items-center gap-1'>
						<CardDescription>
							Don't have an account?
						</CardDescription>
						<Button
							variant='link'
							className='px-0'
							asChild>
							<Link to='/register'>Register</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
