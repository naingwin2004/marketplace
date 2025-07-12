import { useState, useEffect } from "react";
import { Search, X, Check, Ellipsis } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableFooter,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

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
function formatMMK(amount) {
	if (amount >= 100000) {
		return (amount / 100000).toFixed(1).replace(".0", "") + "Lakh";
	}
	return amount + "Kyat";
}

export const ProductsTable = ({ data }) => {
	return (
		<>
			{data?.products.length !== 0 && (
				<Table>
					<TableCaption>A list of your recent products</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Warranty</TableHead>
							<TableHead>Voucher</TableHead>
							<TableHead>Price</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.products?.map((product, index) => (
							<TableRow key={index}>
								<TableCell className='font-medium min-w-[100px]'>
									<span className='line-clamp-1 break-words'>
										{product?.name}
									</span>
								</TableCell>
								<TableCell>{product?.category}</TableCell>
								<TableCell>
									<Badge
										variant={
											product?.status === "pending"
												? ""
												: product?.status === "active"
												? "secondary"
												: "destructive"
										}>
										{product?.status}
									</Badge>
								</TableCell>
								<TableCell>
									{product?.warranty ? (
										<Check className='text-[#4ebf6b]' />
									) : (
										<X className='text-destructive' />
									)}
								</TableCell>
								<TableCell>
									{product?.voucher ? (
										<Check className='text-[#4ebf6b]' />
									) : (
										<X className='text-destructive' />
									)}
								</TableCell>
								<TableCell>
									{formatMMK(product?.price)}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='ghost'
												size='icon'>
												<Ellipsis size={16} />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuLabel>
												My Account
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem>
												Edit product
											</DropdownMenuItem>
											<DropdownMenuItem>
												Update images
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem>
												<span className='text-destructive'>
													Drop Products
												</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};
const ProductPagination = ({ isFetching, data, page, setPage }) => {
	return (
		<>
			{!isFetching &&
				data?.totalPages > 1 &&
				data?.products.length > 1 && (
					<Pagination className={isFetching && "pointer-events-none"}>
						<PaginationContent>
							{/* Previous Button */}
							<PaginationItem>
								<button
									disabled={page <= 1}
									className='disabled:pointer-events-none disabled:opacity-50'>
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
								if (
									pageNumber < 1 ||
									pageNumber > data.totalPages
								)
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
									className='disabled:pointer-events-none disabled:opacity-50'>
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
		</>
	);
};
import { useProductsQuery } from "@/services/products.js";

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
				<p className="text-center">Getting Products...</p>
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
