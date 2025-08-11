import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import UserTable from "./UserTable";

const ManageUser = () => {
	const [search, setSearch] = useState("");
	return (
		<div className="h-full flex flex-col space-y-6 ">
			<div className="flex justify-center items-center space-x-3">
				<div className="w-full relative max-w-sm">
					<div className="absolute inset-y-0 left-3 flex justify-center items-center">
						<Search className="w-5 h-5" />
					</div>
					<Input
						placeholder="Search"
						className="pl-10"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setSearch("")}>
					<X className="w-5 h-5" />
				</Button>
			</div>
			<div className="flex justify-center items-center space-x-3">
				<Badge variant="outline">All</Badge>
				<Badge>Active</Badge>
				<Badge>Ban</Badge>
				<Badge>CreatedAt</Badge>
			</div>
			
			<UserTable/>
		</div>
	);
};

export default ManageUser;
