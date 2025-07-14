import { useState } from "react";

import Images from "./components/Images";
import CoverImageUpload from "./components/CoverImageUpload";
import { Button } from "@/components/ui/button";

function UpdateImages() {
	const [files, setFiles] = useState([]);
	const [cover, setCover] = useState([]);

	const handleSubmit = () => {
		console.log(files);
		console.log(cover[0]);
	};

	return (
		<div className='h-full space-y-6 flex flex-col'>
			<CoverImageUpload setCover={setCover} />
			<Images setFiles={setFiles} />
			<Button onClick={handleSubmit}>Submit</Button>
		</div>
	);
}

export default UpdateImages;
