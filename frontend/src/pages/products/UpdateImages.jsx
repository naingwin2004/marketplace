import { toast } from "sonner";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { LoaderCircle } from "lucide-react";

import Images from "./components/Images";
import CoverImageUpload from "./components/CoverImageUpload";

import { Button } from "@/components/ui/button";

import { useUpdateImageMutation, useGetImagesQuery } from "@/services/products";

function UpdateImages() {
	const [files, setFiles] = useState([]);
	const [cover, setCover] = useState([]);

	const { id } = useParams();
	const navigate = useNavigate();

	const [updateImageMutation, { error, isLoading }] =
		useUpdateImageMutation();

	const {
		data,
		error: isImagesError,
		isLoading: isImagesLoading
	} = useGetImagesQuery(id);

	const handleSubmit = async () => {
		try {
			if (!cover || !cover[0]?.file) {
				toast.error("Cover image is required!");
				return;
			}

			const formData = new FormData();
			formData.append("cover", cover[0].file);

			if (files && files.length > 0) {
				files.forEach(file => {
					formData.append("images", file.file);
				});
			}

			const res = await updateImageMutation({ id, formData }).unwrap();
			console.log(res);
			toast.success(res?.message);
			navigate(`/product/${res.id}`);
		} catch (err) {
			console.error("error in UpdateImages ", err);
			toast.error(err?.message || "UpdateImages error");
		}
	};

	if (error || isImagesError) {
		return <p>{error?.data?.message || isImagesError?.data?.message}</p>;
	}
	if (isImagesLoading) {
		return <p>Loading images...</p>;
	}

	return (
		<div className="h-full space-y-6 flex flex-col">
			<p className="text-2xl font-bold">{data?.name}</p>
			<div className="max-w-sm self-center space-y-6">
				<CoverImageUpload setCover={setCover} data={data?.coverImage} />
				<Images setFiles={setFiles} data={data?.arrayImages} />
				<Button
					onClick={handleSubmit}
					disabled={isLoading}
					className="w-full">
					{isLoading ? (
						<LoaderCircle className="animate-spin w-4 h-4" />
					) : (
						"Submit"
					)}
				</Button>
			</div>
		</div>
	);
}

export default UpdateImages;
