import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useCheckAuthQuery } from "../services/auth.js";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import ProductCard from "../pages/ProductCard.jsx";

const Home = () => {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [searchThem, setSearchThem] = useState("");
	const [sortby, setSortChange] = useState("newest");
	const { data, error, isError } = useCheckAuthQuery();

	let url = "http://localhost:300/products";
	const params = new URLSearchParams();

	if (searchThem) {
		params.append("search", searchThem);
	}
	if (sortby) {
		params.append("sort", sortby);
	}
	if (selectedCategory) {
		params.append("category", selectedCategory);
	}

	if ([...params].length > 0) {
		url += `?${params.toString()}`;
	}

	console.log(url);

	if (error?.error) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>{error?.status} : Please Check Your Internet</p>
			</div>
		);
	}
	if (error?.data) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>{error?.data?.message}</p>
			</div>
		);
	}

	const categoryData = [
		{ value: "", name: "All Products" },
		{ value: "electronics", name: "Electronics and Gadgets" },
		{ value: "clothing", name: "Clothing and Fashion" },
		{ value: "home", name: "Home & Kitchen" },
		{ value: "sports", name: "Sports & Outdoors" },
		{ value: "toys", name: "Toys and Games" },
		{ value: "beauty", name: "Beauty and Personal Care" },
		{ value: "books", name: "Books ans Media" },
	];
	return (
		<div className='h-full flex flex-col space-y-8 items-center'>
			<div className='flex flex-col items-center'>
				<p className='text-lg font-medium'>ECSB</p>
				<p className='text-sm text-muted-foreground'>
					Easily connect with trusted sellers/buyers you can rely on
				</p>
			</div>

			{/* Search */}
			<div className='w-full flex justify-center items-center'>
				<div className='relative w-full max-w-md'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
					<Input
						type='text'
						placeholder='Search products...'
						className='pl-10'
						value={searchThem}
						onChange={(e) => setSearchThem(e.target.value)}
					/>
				</div>
			</div>

			{/* Category Filter */}
			<div className='flex flex-wrap gap-2 max-w-2xl justify-center'>
				{categoryData.map((category) => (
					<Button
						key={category.name}
						variant={
							selectedCategory === category.value
								? "default"
								: "outline"
						}
						size='sm'
						onClick={() => setSelectedCategory(category.value)}
						className='whitespace-nowrap'>
						<span className='md:hidden'>
							{category.value === "" ? "All" : category.value}
						</span>
						<span className='hidden md:block'>
							{category.value === "" ? "All" : category.name}
						</span>
					</Button>
				))}
			</div>

			{/* Sort */}
			<Select
				value={sortby}
				onValueChange={setSortChange}>
				<SelectTrigger className='w-full lg:w-48'>
					<SelectValue placeholder='Sort by' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='price-low'>
						Price: Low to High
					</SelectItem>
					<SelectItem value='price-high'>
						Price: High to Low
					</SelectItem>
					<SelectItem value='newest'>Newest</SelectItem>
					<SelectItem value='oldest'>Oldest</SelectItem>
				</SelectContent>
			</Select>

			<div className='grid md:grid-cols-3 gap-4 p-4'>
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious href='#' />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href='#'>1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink
							href='#'
							isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href='#'>3</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext href='#' />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};

export default Home;
