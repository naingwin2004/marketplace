import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Heart, ArrowLeft, Check, X, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatMMK } from "@/lib/formatMMK";
import { formatDate } from "@/lib/formatDate";

import {
	useProductDetailsQuery,
	useSaveProductMutation,
	useGetSaveProductQuery,
	useUnSaveProductMutation
} from "@/services/products.js";

const ProductDetails = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [selectedImage, setSelectedImage] = useState(0);

	const user = useSelector(state => state.auth?.user?._id);

	const { data, isLoading, error } = useProductDetailsQuery(id);
	const { data: saveData } = useGetSaveProductQuery();
	const isSaved = saveData?.some(item => item.productId?._id === data?._id);

	const [saveProductMutation] = useSaveProductMutation();
	const [unSaveProductMutation] = useUnSaveProductMutation();

	if (error?.error) {
		return (
			<div className="h-full flex justify-center items-center">
				<p>{error?.status} : Please Check Your Internet</p>
			</div>
		);
	}

	if (error?.data) {
		return (
			<div className="h-full flex justify-center items-center">
				<p>{error?.data?.message}</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="h-full flex justify-center items-center">
				<p>Getting Products Details...</p>
			</div>
		);
	}

	// what filter(Boolean) work ? remove falsy value
	const productImages = [data?.coverImage, ...data?.arrayImages].filter(
		Boolean
	);

	const hasImages = productImages.length > 0;

	const handleFav = async id => {
		try {
			const res = await saveProductMutation(id).unwrap();

			toast.success(res?.message || "success");
		} catch (err) {
			console.error("Error in handleFav ", err);
			toast.error(err?.data?.message);
		}
	};
	const handleUnSave = async id => {
		try {
			const res = await unSaveProductMutation(id).unwrap();

			toast.success(res?.message || "success");
		} catch (err) {
			console.error("Error in handleUnSave ", err);
			toast.error(err?.data?.message);
		}
	};

	return (
		<div className="h-full flex flex-col space-y-6  max-w-6xl mx-3">
			<div className="self-end">
				<Button
					variant="ghost"
					className="group"
					onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
					Go back
				</Button>
			</div>

			<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
				{/* Image Section */}
				<div className="space-y-4">
					{/* Main Image Display */}
					<AspectRatio ratio={1} className="w-full">
						{hasImages ? (
							<img
								src={productImages[selectedImage]?.url}
								alt={data?.name}
								className="w-full h-full rounded-lg object-cover border bg-accent "
							/>
						) : (
							<div className="w-full h-full bg-accent rounded-lg border flex items-center justify-center">
								<div className="text-center text-muted-foreground">
									<div className="text-4xl mb-2">📦</div>
									<p>No Image Available</p>
								</div>
							</div>
						)}
					</AspectRatio>

					{/* Image Thumbnails */}
					{hasImages && productImages.length > 1 && (
						<div className="grid grid-cols-4 gap-2">
							{productImages.map((image, index) => (
								<div
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`aspect-square overflow-hidden rounded-md border-2 ${
										selectedImage === index
											? "border-primary"
											: "border-secondary"
									}`}>
									<img
										src={image?.url}
										alt={`Product view ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Product Details Section */}
				<div className="space-y-6">
					{/* Header */}
					<div className="space-y-4">
						<div className="flex items-start justify-between">
							<h1 className="text-3xl font-bold">{data?.name}</h1>

							{isSaved ? (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleUnSave(data?._id)}
									className="hover:bg-red-50 hover:text-red-500 text-red-500
								">
									<Heart
										className={`h-5 w-5
										fill-current
									`}
									/>
								</Button>
							) : (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleFav(data?._id)}
									className={`hover:bg-red-50 hover:text-red-500`}>
									<Heart className={`h-5 w-5`} />
								</Button>
							)}
						</div>

						{/* Price */}
						<div className="flex justify-between items-center">
							<p className="text-xl font-bold">
								{formatMMK(data?.price)}
							</p>
							<Badge variant="secondary" className="capitalize">
								{data?.category}
							</Badge>
						</div>
					</div>

					{/* Product created Date Card */}

					<Card className="bg-accent">
						<CardContent className="p-4">
							<div className="flex justify-between items-center text-xs text-muted-foreground">
								<span>
									Listed on {formatDate(data?.createdAt)}
								</span>
								{data?.createdAt !== data?.updatedAt && (
									<span>
										Updated {formatDate(data?.updatedAt)}
									</span>
								)}
							</div>
						</CardContent>
					</Card>

					<Separator />

					{/* Description */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Description</h3>
						<p className="text-muted-foreground leading-relaxed">
							{data?.description}
						</p>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center justify-between p-3 bg-accent rounded-lg">
								<span className="text-sm font-medium">
									Warranty
								</span>

								{data?.warranty ? (
									<Check className="text-[#4ebf6b]" />
								) : (
									<X className="text-destructive" />
								)}
							</div>
							<div className="flex items-center justify-between p-3 bg-accent rounded-lg px-3">
								<span className="text-sm font-medium">
									Voucher
								</span>

								{data?.voucher ? (
									<Check className="text-[#4ebf6b]" />
								) : (
									<X className="text-destructive" />
								)}
							</div>
						</div>
					</div>

					<Separator />

					{/* Seller Info */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">
							Seller Information
						</h3>
						<Card>
							<CardContent className="p-4 space-y-4">
								<div className="flex items-center gap-4">
									<Avatar className="w-12 h-12">
										<AvatarImage
											src={data?.seller?.avatar?.url}
										/>
										<AvatarFallback className="text-md">
											{data?.seller?.username
												.split(" ")
												.map(n => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<span className="text-md font-medium">
										{data?.seller?.username}
									</span>

									<Badge className="ml-auto capitalize">
										{data?.seller?.role}
									</Badge>
								</div>
								<div className="flex flex-col space-y-2 text-sm text-muted-foreground">
									<p>Email : {data?.seller?.email}</p>
									<p className="flex gap-1">
										<span className="shrink-0">Bio : </span>
										<span className="break-all">
											{data?.seller?.bio}
										</span>
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3 pt-4">
						{user === data?.seller?._id && (
							<div className="flex space-x-3">
								<Button
									className="w-full"
									variant="outline"
									size="lg">
									<Link to={`/edit-product/${data?._id}`}>
										Edit Product
									</Link>
								</Button>
								<Button
									className="w-full"
									variant="outline"
									size="lg">
									<Link to={`/images/${data?._id}`}>
										Update Images
									</Link>
								</Button>
							</div>
						)}
						<Button className="w-full" size="lg">
							Button 2
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
