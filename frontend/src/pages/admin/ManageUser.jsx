import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import UserTable from "./UserTable";
import { useGetUsersQuery } from "../../services/admin";

const ManageUser = () => {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");

	const { data, isLoading, error, isError, isFetching } = useGetUsersQuery({
		status
	});

	if (isLoading) {
		return (
			<div className="h-full flex justify-center items-center text-2xl font-medium">
				Getting Users...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="h-full flex justify-center items-center text-2xl font-medium">
				{error.data ? error.data.message : "Somthing worng"}
			</div>
		);
	}

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
				{["", "active", "banned"].map(b => (
					<Badge
						key={b}
						className="capitalize"
						onClick={() => setStatus(b)}
						variant={status == b ? "outline" : ""}>
						{b === "" ? "All" : b}
					</Badge>
				))}
			</div>
			{isFetching && <p className="text-center">Getting...</p>}
			{!isFetching && data.users.length === 0 && (
				<p className="font-medium text-2xl text-center"> No users</p>
			)}
			{!isFetching && data.users.length > 0 && (
				<UserTable users={data.users} />
			)}
		</div>
	);
};

export default ManageUser;
