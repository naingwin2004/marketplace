import { X, Check, Ellipsis, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

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
	TableFooter
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";

import { formatMMK } from "@/lib/formatMMK";
import { useDeleteProductMutation } from "@/services/products";
import {
	useGetProductsQuery,
	useUpdateProductStatusMutation
} from "@/services/admin.js";

export const ProductsTable = ({ data }) => {
	const timeoutRef = useRef(null);
	const [products, setProducts] = useState(data?.products || []);
	const [selectedStatus, setSelectedStatus] = useState("");

	const [deleteProductMutation, { isLoading }] = useDeleteProductMutation();

	const handleDelete = (name, id) => {
		toast(`Deleting ${name} in 5 seconds...`, {
			duration: 5000,
			action: {
				label: "Undo",
				onClick: () => {
					clearTimeout(timeoutRef.current);
				}
			},
			icon: <Trash size={16} />
		});

		// Delay API call by 5s
		timeoutRef.current = setTimeout(async () => {
			const res = await deleteProductMutation(id).unwrap();

			toast.success(res?.message || "deleted ");

			const filterProducts = products.filter(
				product => product._id !== id
			);
			setProducts(filterProducts);
		}, 5000);
	};

	const [updateProductStatus] = useUpdateProductStatusMutation();

	const handleStatusChange = async (id, newStatus) => {
		try {
			const res = await updateProductStatus({
				id,
				status: newStatus
			}).unwrap();
			toast.success(res.message || "Product status updated");
		} catch (error) {
			toast.error(error?.data?.message || "Failed to update status");
		}
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
							<TableHead>Price</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products?.map((product, index) => (
							<TableRow key={index}>
								<TableCell className="font-medium min-w-[100px]">
									<span className="line-clamp-1 break-words">
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
									{formatMMK(product?.price)}
								</TableCell>
								<TableCell>
									<DropdownMenu
										onOpenChange={open => {
											if (open) {
												setSelectedStatus(
													product.status
												);
											}
										}}>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<Ellipsis size={16} />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="mx-3">
											<DropdownMenuLabel>
												Account
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuRadioGroup
												value={selectedStatus}
												onValueChange={
													setSelectedStatus
												}>
												{[
													"active",
													"reject",
													"pending"
												].map(value => (
													<DropdownMenuRadioItem
														key={value}
														value={value}
														onClick={() =>
															handleStatusChange(
																product._id,
																value
															)
														}
														className="capitalize">
														{value}
													</DropdownMenuRadioItem>
												))}
											</DropdownMenuRadioGroup>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() =>
													handleDelete(
														product.name,
														product._id
													)
												}>
												<span className="text-destructive">
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
