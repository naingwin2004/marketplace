import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
	Search,
	X,
	Check,
	Ellipsis,
	CircleCheckIcon,
	XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectSeparator,
	SelectValue,
} from "@/components/ui/select";

import { useProductsQuery } from "@/services/products.js";
import { ProductsTable } from "./components/ProductsTable";
import { ProductPagination } from "./components/ProductPagination";

const categoryData = [
	"electronics",
	"clothing",
	"home",
	"sports",
	"toys",
	"beauty",
	"books",
];

const statusData = ["active", "pending", "reject"];

const ManageProducts = () => {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [waitSearch, setWaitSearchQuery] = useState("");
	const [category, setCategory] = useState("");
	const [status, setStatus] = useState("");

	const { data, error, isLoading, isFetching } = useProductsQuery({
		page,
		status,
		category,
		waitSearch,
	});

	useEffect(() => {
		const time = setTimeout(() => {
			setWaitSearchQuery(search);
		}, 250);
		return () => clearTimeout(time);
	}, [search]);

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
	if (isLoading) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>Getting Products...</p>
			</div>
		);
	}
	return (
		<div className='h-full flex flex-col space-y-6 '>
			<div className='flex justify-center items-center md:flex-row flex-col md:space-y-0 md:space-x-3 space-y-3'>
				<div className='w-full relative max-w-sm'>
					<div className='absolute inset-y-0 left-3 flex justify-center items-center'>
						<Search className='w-5 h-5' />
					</div>
					<Input
						placeholder='Search'
						className='pl-10'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<div className='flex w-full justify-center items-center space-x-3'>
					<Select
						value={category}
						onValueChange={setCategory}>
						<SelectTrigger className='flex-1'>
							<SelectValue placeholder='Category' />
						</SelectTrigger>
						<SelectContent>
							{categoryData.map((cat) => (
								<SelectItem
									key={cat}
									value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={status}
						onValueChange={setStatus}>
						<SelectTrigger className='flex-1'>
							<SelectValue placeholder='Status' />
						</SelectTrigger>
						<SelectContent>
							{statusData.map((data) => (
								<SelectItem
									key={data}
									value={data}>
									{data}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						variant='outline'
						size='icon'
						onClick={() => {
							setSearch("");
							setCategory("");
							setStatus("");
							setPage(1);
						}}>
						<X className='w-5 h-5' />
					</Button>
				</div>
			</div>
			{data?.products.length == 0 && (
				<div className='flex flex-1 justify-center items-center'>
					<p className='text-2xl font-bold'>No products Found...</p>
				</div>
			)}
			{isFetching ? (
				<p className='text-center'>Getting Products...</p>
			) : (
				<ProductsTable data={data} />
			)}

			<ProductPagination
				isFetching={isFetching}
				data={data}
				page={page}
				setPage={setPage}
			/>
		</div>
	);
};

export default ManageProducts;
