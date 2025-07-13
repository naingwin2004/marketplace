import { X, Check, Ellipsis, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { formatMMK } from "@/lib/formatMMK";
import { useDeleteProductMutation } from "@/services/products";

export const ProductsTable = ({ data }) => {
	const timeoutRef = useRef(null);
	const [products, setProducts] = useState(data?.products || []);

	const [deleteProductMutation, { isLoading }] = useDeleteProductMutation();

	const handleDelete = (name, id) => {
		toast(
			`Deleting ${name} in 5 seconds...`,
			{
				duration: 5000,
				action: {
					label: "Undo",
					onClick: () => {
						clearTimeout(timeoutRef.current);
					},
				},
				icon: <Trash size={16} />,
			},
		);

		// Delay API call by 5s
		timeoutRef.current = setTimeout(async () => {
			const res = await deleteProductMutation(id).unwrap();
			toast.success(res?.message || "deleted ");

			const filterProducts = products.filter(
				(product) => product._id !== id,
			);
			setProducts(filterProducts);
		}, 5000);
	};

	return (
		<>
			{products.length !== 0 && (
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
						{products?.map((product, index) => (
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
											<DropdownMenuItem
												onClick={() =>
													handleDelete(
														product.name,
														product._id,
													)
												}>
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
