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

import { Ellipsis } from "lucide-react";

const UserTable = () => {
	return (
		<Table className="max-w-xl mx-auto border">
			<TableCaption>A list of users</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>createdAt</TableHead>
					<TableHead>action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell className="font-medium min-w-[100px] capitalize">
						naing win
					</TableCell>
					<TableCell>
						<Badge variant="secondary">admin</Badge>
					</TableCell>
					<TableCell>
						<Badge variant="destructive">ban</Badge>
					</TableCell>
					<TableCell>2004 july 3</TableCell>
					<TableCell>
						<Dropdown />
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
};

export default UserTable;

const Dropdown = () => {
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
					<DropdownMenuItem>Ban Account</DropdownMenuItem>
					<DropdownMenuItem>Active Account</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<span className="text-destructive">Drop Users</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
