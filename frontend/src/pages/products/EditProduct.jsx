import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
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
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
	useGetOldProductQuery,
	useUpdateProductMutation
} from "@/services/products";

const categoryData = [
	"electronics",
	"clothing",
	"home",
	"sports",
	"toys",
	"beauty",
	"books"
];

const formSchema = z.object({
	name: z.string().nonempty({ message: "Product Name is required" }),
	description: z
		.string()
		.min(1, { message: "Product Description is required" })
		.max(160, {
			message: "description must not be longer than 160 characters."
		}),
	category: z.enum([...categoryData], {
		message: "Please select a category"
	}),
	price: z.coerce
		.number({ message: "Please Enter a price" })
		.min(1000, { message: "Price must be at least 1000" })
		.max(1000000, { message: "Price cannot exceed 1,000,000" }),
	warranty: z.boolean().default(false),
	voucher: z.boolean().default(false)
});

export default function EditProduct() {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data, isLoading, error, isFetching } = useGetOldProductQuery(id);
	const [updateProductMutation, { isLoading: updateIsLoading }] =
		useUpdateProductMutation(id);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			category: "",
			price: "",
			warranty: false,
			voucher: false
		}
	});

	const onSubmit = async values => {
		const data = { ...values, id };
		try {
			const res = await updateProductMutation(data).unwrap();

			toast.success("Product updated successfully!");
			navigate(`/product/${id}`);
		} catch (error) {
			console.error("Update failed", error);
			toast.error("Failed to update product.");
		}
	};

	useEffect(() => {
		if (data) {
			form.reset({
				name: data.name,
				description: data.description,
				category: "electronics",
				price: data.price,
				warranty: data.warranty,
				voucher: data.voucher
			});
		}
	}, [data]);

	if (error) {
		return <p>{error.data?.message}</p>;
	}
	if (isLoading || isFetching) {
		return <p>Getting product...</p>;
	}

	return (
		<div className="h-full flex justify-center items-center">
			<Card className="w-full max-w-2xl">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Edit Product
					</CardTitle>
					<CardDescription className="text-center">
						Update the product details below.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4">
							{/* name */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Product Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Product name"
												type="text"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* description */}
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Product Description
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Short description"
												className="resize-none h-20"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* category + price */}
							<div className="grid grid-cols-12 gap-4">
								<div className="col-span-6">
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={
														data?.category // idk why don't working field.value
													}>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select category" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{categoryData.map(
															cat => (
																<SelectItem
																	key={cat}
																	value={cat}>
																	{cat}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="col-span-6">
									<FormField
										control={form.control}
										name="price"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Price</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* warranty + voucher */}
							<div className="grid grid-cols-12 gap-4">
								<div className="col-span-6">
									<FormField
										control={form.control}
										name="warranty"
										render={({ field }) => (
											<FormItem
												className={cn(
													"flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
													field.value &&
														"border-blue-600 bg-blue-50"
												)}>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>
														Warranty
													</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>

								<div className="col-span-6">
									<FormField
										control={form.control}
										name="voucher"
										render={({ field }) => (
											<FormItem
												className={cn(
													"flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
													field.value &&
														"border-blue-600 bg-blue-50"
												)}>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>
														Voucher
													</FormLabel>
												</div>
											</FormItem>
										)}
									/>
								</div>
							</div>

							<Button type="submit">
								{updateIsLoading
									? "loading..."
									: "Update Product"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
