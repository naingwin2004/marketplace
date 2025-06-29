import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const defaultValues = {
	bio: "",
};

const profileFormSchema = z.object({
	bio: z
		.string()
		.max(160, {
			message: "Bio must not be longer than 160 characters.",
		})
		.optional(),
});

const EditProfile = ({ setOpen }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [previewImage, setPreviewImage] = useState(null);
	const [image, setImage] = useState(null);
	const imageRef = useRef(null);

	const form = useForm({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
	});

	async function onSubmit(data) {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Profile updated:", data)
    setIsLoading(false)
    setOpen(false)
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
				<DialogTitle>Edit Profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're
					done.
				</DialogDescription>
			</DialogHeader>

			{/* Avatar */}
			<div className='flex justify-center items-center space-x-4'>
				<Avatar
					className='h-24 w-24'
					onClick={() => imageRef.current.click()}>
					<AvatarImage
						src={
							previewImage
								? previewImage
								: "/placeholder.svg?height=80&width=80"
						}
						className='object-cover'
						alt='Profile'
					/>
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<Input
					type='file'
					accept='image/*'
					className='hidden'
					ref={imageRef}
					onChange={handleImage}
				/>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'>
					<FormField
						control={form.control}
						name='bio'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Tell us a little bit about yourself'
										className='resize-none'
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
							onClick={() => setOpen(false)}>
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

export default EditProfile;
