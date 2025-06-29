import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSelector } from "react-redux";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Camera, User } from "lucide-react";

import { useChangePasswordMutation } from "@/services/auth.js";
const profileFormSchema = z.object({
	password: z.string().nonempty({
		message: "Password is required.",
	}),
	newPassword: z
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
			message: "Password must contain at least one special character.",
		}),
});

const ChangePassword = ({ setChangePassOpen }) => {
	const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();

	const email = useSelector((state) => state.auth?.user?.email);

	const form = useForm({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			password: "",
			newPassword: "",
		},
	});

	async function onSubmit(values) {
		const data = { ...values, email };
		try {
			const res = await changePasswordMutation(data).unwrap();

			toast.success(res?.message || "Password change successfully");
			setChangePassOpen(false);
		} catch (err) {
			console.log("Error in ChangePassword, onSubmit : ", err);
			toast.error(err?.data?.message || "error");
		}
	}

	const handleImage = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setPreviewImage(imageUrl);
			setImage(file);
		}
	};
	return (
		<DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
			<DialogHeader>
				<DialogTitle>ChangePassword</DialogTitle>
				<DialogDescription>
					Make changes to your password here. Click save when you're
					done.
				</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter current password'
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='newPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter new password'
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-end space-x-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setChangePassOpen(false)}>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isLoading}>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</Form>
		</DialogContent>
	);
};

export default ChangePassword;
