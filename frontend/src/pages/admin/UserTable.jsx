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
	DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";

import { useStatusChangeMutation } from "@/services/admin";

import { formatDate } from "../../lib/formatDate";

const UserTable = ({ users }) => {
	return (
		<Table className="max-w-xl mx-auto border">
			<TableCaption>A list of users</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>createdAt</TableHead>
					<TableHead>action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map(user => (
					<TableRow key={user._id}>
						<TableCell className="font-medium min-w-[100px] capitalize ">
							{user.username}
						</TableCell>
						<TableCell>{user.email.split("@")[0]}</TableCell>
						<TableCell>
							<Badge variant="secondary">{user.role}</Badge>
						</TableCell>
						<TableCell>
							<Badge
								variant={
									user.status === "banned"
										? "destructive"
										: "emerald"
								}>
								{user.status}
							</Badge>
						</TableCell>
						<TableCell className="min-w-[100px]">
							{formatDate(user.createdAt)}
						</TableCell>
						<TableCell>
							<Dropdown id={user._id} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default UserTable;

const Dropdown = ({ id }) => {
	const [changeStatus, { isLoading }] = useStatusChangeMutation();

	const handleBan = async () => {
		try {
			const res = await changeStatus({ id, status: "banned" }).unwrap();
			toast.success(res.message);
		} catch (err) {
			console.log(err);
			toast.error("something worng");
		}
	};

	const handleActive = async() => {
		try {
			const res = await changeStatus({ id, status: "active" }).unwrap();
			toast.success(res.message);
		} catch (err) {
			console.log(err);
			toast.error("something worng");
		}
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Ellipsis size={16} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mx-3">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Account</DropdownMenuLabel>
					<DropdownMenuItem
						className="text-destructive hover:underline"
						onClick={handleBan}>
						Ban Account
					</DropdownMenuItem>
					<DropdownMenuItem
						className="text-emerald-500 hover:underline"
						onClick={handleActive}>
						Active Account
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<span className="text-destructive">Drop Users</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
