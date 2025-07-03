import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ImageSelector = () => {
	const navigate = useNavigate();

	const [selectedImage, setSelectedImage] = useState(0);
	const [isFavorite, setIsFavorite] = useState(false);

	const productImages = [
		"https://github.com/naingwin2004.png",
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0nFiECI0ReVWMgk-wuEJ22--A2dj16RqyTQ&s",
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s",
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCZlf5lc5tX-0gY-y94pGS0mQdL-D0lCH2OQ&s",
	];

	return (
		<div className='h-full flex flex-col items-center space-y-6'>
			<div className='self-end'>
				<Button
					variant='ghost'
					className='group'
					onClick={() => navigate(-1)}>
					<ArrowLeft className='h-4 w-4 group-hover:-translate-x-1 transition-transform' />
					Go back
				</Button>
			</div>

			{/* Product Images */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-xl lg:max-w-3xl'>
				<div className='space-y-4'>
					<div className='aspect-square overflow-hidden rounded-lg bg-gray-100'>
						<img
							src={
								productImages[selectedImage] ||
								"/placeholder.svg"
							}
							alt='Premium Wireless Headphones'
							className='w-full h-full object-cover'
						/>
					</div>
					<div className='grid grid-cols-4 gap-2'>
						{productImages.map((image, index) => (
							<div
								key={index}
								onClick={() => setSelectedImage(index)}
								className={`aspect-square overflow-hidden rounded-md border-2 ${
									selectedImage === index
										? "border-primary"
										: "border-secondary"
								}`}>
								<img
									src={image}
									alt={`Product view ${index + 1}`}
									className='w-full h-full object-cover'
								/>
							</div>
						))}
					</div>
					<Separator />
				</div>

				<div className='space-y-6'>
					<div className='flex items-start justify-between mb-2'>
						<h1 className='text-3xl font-bold'>
							Premium Wireless Headphones
						</h1>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setIsFavorite(!isFavorite)}
							className={`p-2 h-10 w-10 hover:bg-red-50 hover:text-red-500 ${
								isFavorite ? "text-red-500" : "text-gray-400"
							}`}>
							<Heart
								className={`h-5 w-5 ${
									isFavorite ? "fill-current" : ""
								}`}
							/>
						</Button>
					</div>
					<div className='flex items-center gap-4 mb-6 justify-between'>
						<span className='text-xl font-bold'>$199.99</span>

						<Badge variant='secondary'>electronics</Badge>
					</div>
					<p className='text-muted-foreground leading-relaxed'>
						Experience crystal-clear audio with our premium wireless
						headphones. Features noise cancellation, 30-hour battery
						life, and comfortable design perfect for all-day
						listening. Advanced Bluetooth 5.0 connectivity ensures
						stable connection with all your devices.
					</p>
				</div>
			</div>
		</div>
	);
};

export default ImageSelector;
