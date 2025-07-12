import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { useAddProductMutation } from "@/services/products.js";

const categoryData = [
	"electronics",
	"clothing",
	"home",
	"sports",
	"toys",
	"beauty",
	"books",
];

const formSchema = z.object({
	name: z.string().nonempty({ message: "Product Name is required" }),
	description: z
		.string()
		.min(1, { message: "Product Description is required" })
		.max(16, {
			message: "description must not be longer than 160 characters.",
		}),
	category: z.enum([...categoryData], {
		message: "Please select a category",
	}),
	price: z.coerce
		.number({ message: "Please Enter a price" })
		.min(1000, { message: "Price must be at least 1000" })
		.max(1000000, { message: "Price cannot exceed 1,000,000" }),
	warranty: z.boolean().default(false),
	voucher: z.boolean().default(false),
});

export default function MyForm() {
	const navigate = useNavigate();

	const [addProduct, { isLoading }] = useAddProductMutation();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			category: "",
			price: "",
			warranty: false,
			voulcher: false,
		},
	});

	const onSubmit = async (values) => {
		try {
			console.log(values);
			const res = await addProduct(values).unwrap();
			toast.success(res?.message || "success");
			navigate("/");
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	};

	return (
		<div className='h-full flex justify-center items-center'>
			<Card className='w-full max-w-2xl'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						Add to Product
					</CardTitle>
					<CardDescription className='text-center'>
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Product Name</FormLabel>
										<FormControl>
											<Input
												placeholder='I phone X'
												type='text'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Enter your name of your product
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Product Description{" "}
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder='6.1-inch, 48MP camera'
												className='resize-none h-20'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Tell us a little bit about your
											products
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='grid grid-cols-12 gap-4'>
								<div className='col-span-6'>
									<FormField
										control={form.control}
										name='category'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Product Category
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}>
													<FormControl>
														<SelectTrigger className='w-full'>
															<SelectValue placeholder='category' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{categoryData.map(
															(cat) => (
																<SelectItem
																	key={cat}
																	value={cat}>
																	{cat}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>

												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='col-span-6'>
									<FormField
										control={form.control}
										name='price'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Product Price
												</FormLabel>
												<FormControl>
													<Input
														placeholder='1000 to 100Lakh'
														type='number'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className='grid grid-cols-12 gap-4'>
								<div className='col-span-6'>
									<FormField
										control={form.control}
										name='warranty'
										render={({ field }) => (
											<FormItem
												className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${
													field.value
														? "border-blue-600  bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
														: ""
												}`}>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
														className=''
													/>
												</FormControl>
												<div className='space-y-1 leading-none'>
													<FormLabel>
														Warranty
													</FormLabel>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
								</div>

								<div className='col-span-6'>
									<FormField
										control={form.control}
										name='voulcher'
										render={({ field }) => (
											<FormItem
												className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${
													field.value
														? "border-blue-600  bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
														: ""
												}`}>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
												<div className='space-y-1 leading-none'>
													<FormLabel>
														Voulcher
													</FormLabel>

													<FormMessage />
												</div>
											</FormItem>
										)}
									/>
								</div>
							</div>
							<Button type='submit'>Submit</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
