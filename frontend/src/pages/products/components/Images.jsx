import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import {
	AlertCircleIcon,
	LoaderCircle,
	ImageIcon,
	UploadIcon,
	XIcon,
} from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

import { useDeleteImageMutation } from "@/services/products";

export default function Images({ setFiles, data }) {
	const [deleteImageMutation, { isLoading, error }] =
		useDeleteImageMutation();

	const { id: productId } = useParams();
	const navigate = useNavigate();

	const maxSizeMB = 5;
	const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
	const maxFiles = 4;

	const initialFiles = data
		? data.map((item) => ({
				...item,
				isFromServer: true,
		  }))
		: [];

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp",
		maxSize,
		multiple: true,
		maxFiles,
		initialFiles,
	});

	const handleDelete = async (file) => {
		try {
			if (file.file.isFromServer) {
				const imageId = file.file.id;
				const res = await deleteImageMutation({
					productId,
					imageId,
				}).unwrap();

				toast.success(res.message || "Success");
			}

			removeFile(file.id);
		} catch (error) {
			toast.error(
				error?.data.message ||
					"An error occurred while deleting the image.",
			);
			navigate("/products");
		}
	};

	useEffect(() => {
		setFiles(files);
	}, [setFiles, files]);

	return (
		<div className='flex flex-col gap-2'>
			<p className='text-xl font-bold'>Images (optional)</p>
			{/* Drop area */}
			<div
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				data-dragging={isDragging || undefined}
				data-files={files.length > 0 || undefined}
				className='border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]'>
				<input
					{...getInputProps()}
					className='sr-only'
					aria-label='Upload image file'
				/>

				{files.length > 0 ? (
					<div className='flex w-full flex-col gap-3'>
						<div className='flex items-center justify-between gap-2'>
							<h3 className='truncate text-sm font-medium'>
								Uploaded Files ({files.length})
							</h3>
							<Button
								variant='outline'
								size='sm'
								onClick={openFileDialog}
								disabled={
									files.length >= maxFiles || isLoading
								}>
								<UploadIcon
									className='-ms-0.5 size-3.5 opacity-60'
									aria-hidden='true'
								/>
								Add more
							</Button>
						</div>

						<div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
							{files.map((file) => (
								<div
									key={file.id}
									className='bg-accent relative aspect-square rounded-md'>
									<img
										src={file.preview}
										alt={file.file.name}
										className='size-full rounded-[inherit] object-cover'
									/>
									<Button
										onClick={() => handleDelete(file)}
										size='icon'
										className='border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none'
										aria-label='Remove image'
										disabled={isLoading}>
										{isLoading ? (
											<LoaderCircle className='size-3.5 animate-spin' />
										) : (
											<XIcon className='size-3.5' />
										)}
									</Button>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
						<div
							className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
							aria-hidden='true'>
							<ImageIcon className='size-4 opacity-60' />
						</div>
						<p className='mb-1.5 text-sm font-medium'>
							Drop your images here
						</p>
						<p className='text-muted-foreground text-xs'>
							SVG, PNG, JPG, Webp or GIF (max. {maxSizeMB}MB)
						</p>
						<Button
							variant='outline'
							className='mt-4'
							onClick={openFileDialog}>
							<UploadIcon
								className='-ms-1 opacity-60'
								aria-hidden='true'
							/>
							Select images
						</Button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className='text-destructive flex items-center gap-1 text-xs'
					role='alert'>
					<AlertCircleIcon className='size-3 shrink-0' />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
}
