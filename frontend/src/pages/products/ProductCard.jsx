import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter
} from "@/components/ui/card";

import { formatMMK } from "@/lib/formatMMK";
import {
	useSaveProductMutation,
	useGetSaveProductQuery,
	useUnSaveProductMutation
} from "@/services/products.js";

export default function ProductCard({ product }) {
	const [saveProductMutation] = useSaveProductMutation();

	const { data } = useGetSaveProductQuery();

	const [unSaveProductMutation] = useUnSaveProductMutation();
	const isSaved = data?.some(item => item.productId._id === product._id);

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
		<div>
			<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
				{product?.coverImage ? (
					<img
						src={product?.coverImage.url}
						alt="Product Image"
						className="w-full h-48 object-cover rounded-t-lg overflow-hidden bg-accent"
					/>
				) : (
					<div className="w-full h-48 object-cover rounded-t-lg overflow-hidden bg-accent flex justify-center items-center">
						<span className="text-accent-foreground font-black text-2xl">
							ECSB
						</span>
					</div>
				)}

				<CardContent className="p-4 space-y-2">
					<div className="flex items-start justify-between">
						<h3 className="text-lg font-semibold  line-clamp-2 flex-1">
							{product.name}
						</h3>
						{isSaved ? (
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-red-50 hover:text-red-500 text-red-500
								"
								onClick={() => handleUnSave(product._id)}>
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
								onClick={() => handleFav(product._id)}
								className={`hover:bg-red-50 hover:text-red-500`}>
								<Heart className={`h-5 w-5`} />
							</Button>
						)}
					</div>

					<p className="text-muted-foreground text-sm line-clamp-3">
						{product.description}
					</p>

					<div className="flex items-center justify-between">
						<span className="text-xl font-bold text-muted-foreground">
							{formatMMK(product.price)}
						</span>
						<Badge variant="secondary" className="capitalize">
							{product.category}
						</Badge>
					</div>
				</CardContent>

				<CardFooter className="p-4 pt-0 flex justify-between">
					<Link to={`/product/${product._id}`}>
						<Button variant="outline" className="w-full group">
							See More
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Button>
					</Link>

					<span>{product.createdAt.split("T")[0]}</span>
				</CardFooter>
			</Card>
		</div>
	);
}
