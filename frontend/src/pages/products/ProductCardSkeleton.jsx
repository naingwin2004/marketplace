import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const ProductCardSkeleton = () => {
	return (
		<Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
			<Skeleton className='w-full h-48' />
			<CardContent className='p-4 space-y-6'>
				<div className='flex items-start justify-between space-x-6'>
					<Skeleton className='h-8 w-full' />
					<Skeleton className='h-8 w-10' />
				</div>
				<Skeleton className='h-16 w-full' />
			</CardContent>
		</Card>
	);
};

export default ProductCardSkeleton;
