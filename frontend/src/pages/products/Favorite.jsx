import ProductCard from "../products/ProductCard";
import ProductCardSkeleton from "../products/ProductCardSkeleton";

import { useGetSaveProductQuery } from "@/services/products.js";

const Favorite = () => {
	const { data, isLoading } = useGetSaveProductQuery();

	return (
		<>
			<div className="flex flex-col p-4 mx-auto space-y-2">
				<h1 className="text-2xl font-bold text-center">
					Your Favorite Items
				</h1>
				<p className="text-gray-600 text-sm">
					Here are the items you've marked as favorites. Easily access
					the things you love most in one place.
				</p>
			</div>
			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-4">
					{Array.from({ length: 9 }).map((_, index) => (
						<ProductCardSkeleton key={index} />
					))}
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
				{data?.map(product => (
					<ProductCard
						key={product._id}
						product={product.productId}
					/>
				))}
			</div>
		</>
	);
};

export default Favorite;
