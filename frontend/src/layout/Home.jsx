import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState, useEffect, useRef } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from "@/components/ui/pagination";

import ProductCard from "../pages/products/ProductCard";
import ProductCardSkeleton from "../pages/products/ProductCardSkeleton";

import { usePublicProductsQuery } from "../services/products.js";

const categoryData = [
	{ value: "", name: "All Products" },
	{ value: "electronics", name: "Electronics and Gadgets" },
	{ value: "clothing", name: "Clothing and Fashion" },
	{ value: "home", name: "Home & Kitchen" },
	{ value: "sports", name: "Sports & Outdoors" },
	{ value: "toys", name: "Toys and Games" },
	{ value: "beauty", name: "Beauty and Personal Care" },
	{ value: "books", name: "Books ans Media" }
];

const Home = () => {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [waitSearchQuery, setWaitSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const [sortby, setSortChange] = useState("newest");

	const viewRef = useRef(null);

	const {
		data,
		isLoading ,
		error,
		isError,
		isFetching
	} = usePublicProductsQuery({
		page,
		waitSearchQuery,
		sortby,
		selectedCategory
	});

	useEffect(() => {
		const time = setTimeout(() => {
			setWaitSearchQuery(searchQuery);
		}, 250);
		return () => clearTimeout(time);
	}, [searchQuery]);

	const isMobile = window.innerWidth < 768;

	const [prevPage, setPrevPage] = useState(1);

	useEffect(() => {
		if (page !== prevPage && isMobile) {
			viewRef.current?.scrollIntoView({ behavior: "smooth" });
		}
		setPrevPage(page);
	}, [page, prevPage]);

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

	return (
		<div className="h-full flex flex-col items-center">
			<div className="space-y-6 mb-3 flex flex-col items-center">
				<div className="flex flex-col items-center">
					<p className="text-lg font-medium">ECSB</p>
					<p className="text-sm text-muted-foreground">
						Easily connect with trusted sellers/buyers you can rely
						on
					</p>
				</div>

				{/* Search */}
				<div className="w-full flex justify-center items-center gap-4">
					<div className="relative w-full max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
						<Input
							type="text"
							placeholder="Search products..."
							className="pl-10"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button
						variant="outline"
						size="icon"
						disabled={searchQuery ? false : true}
						onClick={() => setSearchQuery("")}>
						<X size={18} />
					</Button>
				</div>

				{/* Category Filter */}
				<div className="flex flex-wrap gap-2 max-w-2xl justify-center">
					{categoryData.map(category => (
						<Button
							key={category.name}
							variant={
								selectedCategory === category.value
									? "default"
									: "outline"
							}
							size="sm"
							onClick={() => setSelectedCategory(category.value)}
							className="whitespace-nowrap">
							<span className="md:hidden">
								{category.value === "" ? "All" : category.value}
							</span>
							<span className="hidden md:block">
								{category.value === "" ? "All" : category.name}
							</span>
						</Button>
					))}
				</div>

				{/* Sort */}
				<Select value={sortby} onValueChange={setSortChange}>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="price-low">
							Price: Low to High
						</SelectItem>
						<SelectItem value="price-high">
							Price: High to Low
						</SelectItem>
						<SelectItem value="newest">Newest</SelectItem>
						<SelectItem value="oldest">Oldest</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{/* scroll to view */}
			<div ref={viewRef}></div>

			{data?.products.length == 0 && (
				<div className="flex flex-1 justify-center items-center">
					<p className="text-2xl font-bold">No products Found...</p>
				</div>
			)}

			{/* isLoading and isFetching show ProductCardSkeleton */}
			{(isLoading || isFetching) && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-4">
					{Array.from({ length: 9 }).map((_, index) => (
						<ProductCardSkeleton key={index} />
					))}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
				{!isFetching &&
					data?.products.map(product => (
						<ProductCard key={product._id} product={product} />
					))}
			</div>

			{!isFetching && data?.totalPages > 1 && (
				<Pagination className={isFetching && "pointer-events-none"}>
					<PaginationContent>
						{/* Previous Button */}
						<PaginationItem>
							<button
								disabled={page <= 1}
								className="disabled:pointer-events-none disabled:opacity-50">
								<PaginationPrevious
									onClick={() => {
										setPage(page - 1);
									}}
								/>
							</button>
						</PaginationItem>

						{/* Dynamic page numbers */}
						{Array.from({ length: 3 }, (_, i) => {
							const pageNumber = page - 1 + i;
							if (pageNumber < 1 || pageNumber > data.totalPages)
								return null;
							return (
								<PaginationItem key={pageNumber}>
									<PaginationLink
										isActive={pageNumber === page}
										onClick={() => {
											setPage(pageNumber);
										}}>
										{pageNumber}
									</PaginationLink>
								</PaginationItem>
							);
						})}

						{/* Next Button */}
						<PaginationItem>
							<button
								disabled={page >= data.totalPages}
								className="disabled:pointer-events-none disabled:opacity-50">
								<PaginationNext
									onClick={() => {
										setPage(page + 1);
									}}
								/>
							</button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}

			{/* Footer */}
			{data?.totalPages > 0 && (
				<footer className="text-center text-muted-foreground text-sm py-4">
					Page {data?.currentPage} of {data?.totalPages}
				</footer>
			)}
		</div>
	);
};

export default Home;
