import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
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

import {
	useUpdatedProfileMutation,
	useCheckAuthQuery,
} from "@/services/auth.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const profileFormSchema = z.object({
	username: z
		.string()
		.min(2, {
			message: "username must be at least 2 characters.",
		})
		.max(30, {
			message: "username must not be longer than 30 characters.",
		}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	bio: z
		.string()
		.max(160, {
			message: "Bio must not be longer than 160 characters.",
		})
		.optional(),
	avatar: z
		.instanceof(File, {
			message: "Please select an image file.",
		})
		.optional()
		.refine((file) => !file || file.size <= MAX_FILE_SIZE, {
			message: `The image is too large. Please choose an image smaller than ${formatBytes(
				MAX_FILE_SIZE,
			)}.`,
		})
		.refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
			message: "Please upload a valid image file (JPEG, PNG, or WebP).",
		}),
});

const EditProfile = ({ setOpen }) => {
	const [previewImage, setPreviewImage] = useState(null);

	const imageRef = useRef(null);

	const [updatedProfileMutation, { isLoading }] = useUpdatedProfileMutation();
	const { refetch } = useCheckAuthQuery();

	const user = useSelector((state) => state.auth.user);

	const form = useForm({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			username: user?.username || "",
			email: user?.email || "",
			bio: user?.bio || "",
			avatar: undefined,
		},
	});

	async function onSubmit(data) {
		try {
			const formData = new FormData();
			formData.append("avatar", data.avatar);
			formData.append("username", data.username);
			formData.append("bio", data.bio);

			const res = await updatedProfileMutation(formData).unwrap();

			toast.success(res?.message || "success");
			refetch();
			setOpen(false);
		} catch (err) {
			console.log("EditProfile err ", err);
			toast.error(err.data.message || "failer");
		}
	}

	const handleImage = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > MAX_FILE_SIZE) {
				const error = `The image is too large. Please choose an image smaller than ${formatBytes(
					MAX_FILE_SIZE,
				)}.`;
				form.setError("avatar", { message: error });
				return;
			}

			// File type validation
			if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
				const error =
					"Please upload a valid image file (JPEG, PNG, or WebP).";
				form.setError("avatar", { message: error });
				return;
			}

			const imageUrl = URL.createObjectURL(file);
			setPreviewImage(imageUrl);
			form.setValue("avatar", file);
			form.clearErrors("avatar");
		}
	};

	return (
		<DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
			<DialogHeader>
				<DialogTitle>Edit Profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're
					done.
				</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6 max-w-md mx-auto'>
					{/* Avatar */}
					<FormField
						control={form.control}
						name='avatar'
						render={({ field }) => (
							<FormItem className='flex flex-col items-center space-y-2'>
								<FormLabel>
									Profile Picture ( Optional )
								</FormLabel>
								<FormControl>
									<div className='flex flex-col items-center gap-4'>
										<Avatar
											className='h-24 w-24 cursor-pointer'
											onClick={() =>
												imageRef.current?.click()
											}>
											<AvatarImage
												src={
													previewImage ||
													user?.avatar?.url ||
													"/placeholder.svg?height=80&width=80"
												}
												className='object-cover'
												alt='Profile'
											/>
											<AvatarFallback>JD</AvatarFallback>
										</Avatar>
										<Input
											type='file'
											ref={imageRef}
											onChange={handleImage}
											accept={ACCEPTED_IMAGE_TYPES.join(
												",",
											)}
											className='hidden'
										/>
										<Button
											type='button'
											variant='outline'
											size='sm'
											onClick={() =>
												imageRef.current?.click()
											}>
											<Camera className='w-4 h-4 mr-2' />
											Change Photo
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>FullName</FormLabel>
								<FormControl>
									<Input
										placeholder='Naing Win'
										type='text'
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Enter your FullName
								</FormDescription>
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
										placeholder='example@gmail.com'
										type='email'
										disabled={true}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									This is the email address associated with
									your account.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='bio'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio ( Optional )</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Tell us a little bit about yourself'
										className='resize-none h-20'
										{...field}
									/>
								</FormControl>
								<FormDescription>
									{field.value?.length || 0}/160 characters
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-end space-x-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								form.reset({
									username: "",
									bio: "",
									email: user?.email,
									image: undefined,
								});
								setPreviewImage(null);
								if (imageRef.current) {
									imageRef.current.value = "";
								}
							}}>
							Reset
						</Button>
					</div>
					<Button
						type='submit'
						className='w-full'
						disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</Form>
		</DialogContent>
	);
};

export default EditProfile;
