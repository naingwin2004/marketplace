import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";

export default function ProductCard() {
	return (
		<div>
			<Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
				<img
					src='https://github.com/naingwin2004.png'
					alt='Product Image'
					className='w-full h-48 object-cover rounded-t-lg overflow-hidden'
				/>

				<CardContent className='p-4'>
					<div className='flex items-start justify-between mb-2'>
						<h3 className='text-lg font-semibold  line-clamp-2 flex-1'>
							Premium Wireless Headphones
						</h3>
						<Button
							variant='ghost'
							size='sm'
							className='p-1 h-8 w-8 hover:bg-red-50 hover:text-red-500'>
							<Heart className='h-4 w-4' />
						</Button>
					</div>

					<p className='text-muted-foreground text-sm line-clamp-3 mb-4'>
						Experience crystal-clear audio with our premium wireless
						headphones. Features noise cancellation, 30-hour battery
						life, and comfortable design perfect for all-day
						listening.
					</p>

					<div className='flex items-center justify-between'>
						<span className='text-2xl font-bold text-muted-foreground'>
							$199.99
						</span>
						<Badge variant='secondary'>electronics</Badge>
					</div>
				</CardContent>

				<CardFooter className='p-4 pt-0'>
					<Link to='product/123'>
						<Button className='w-full group'>
							See More
							<ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
