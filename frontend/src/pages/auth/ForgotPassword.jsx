import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

import { useForgotPasswordMutation } from "@/services/auth.js";

const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address." }),
});

const ForgotPassword = () => {
	const navigate = useNavigate();


	const form = useForm({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

	async function onSubmit(values) {
		try {
			const res = await forgotPasswordMutation(values).unwrap();
			toast.success(res?.message);
			navigate("/login", { replace: true });
		} catch (err) {
			console.log("Error in ForgotPassword, onSubmit : ", err);
			toast.error(err?.message || err?.data?.message || "Failer");
		}
	}

	return (
		<div className='h-full flex flex-col justify-center items-center space-y-4'>
			<div className='relative w-full max-w-md'>
				<Button
					variant='outline'
					onClick={() => navigate(-1)}
					className='absolute bottom-0 right-0 flex items-center space-x-2'>
					<ArrowLeft className='w-4 h-4' />
					<span>Go Back</span>
				</Button>
			</div>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						ForgotPassword
					</CardTitle>
					<CardDescription className='text-center'>
						Enter your email to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							className='space-y-4'
							onSubmit={form.handleSubmit(onSubmit)}>
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
				</CardContent>
			</Card>
		</div>
	);
};

export default ForgotPassword;
