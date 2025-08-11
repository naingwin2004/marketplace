import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from "@/components/ui/pagination";

export const ProductPagination = ({ isFetching, data, page, setPage }) => {
  
	return (
		<>
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
		</>
	);
};
