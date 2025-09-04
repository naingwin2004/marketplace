import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";

import { Users, Package, DollarSign } from "lucide-react";

const Dashboard = () => {
	return (
		<div className="h-full">
			<h1 className="text-2xl font-medium text-center">Dashboard</h1>
			<p className="text-sm text-muted-foreground text-center">
				Dashboard
			</p>

			<div className="grid md:grid-cols-3 grid-cols-1 gap-3 my-3">
				<TotalUsersCard totalUsers={69} />

				<TotalProductsCard totalProducts={1234} />

				<TotalRevenueCard totalRevenue={45678.9} />
			</div>
			{/* For chart */}
		</div>
	);
};

export default Dashboard;

const TotalProductsCard = ({ totalProducts }) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Total Products
				</CardTitle>
				<Package className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-foreground">
					{totalProducts.toLocaleString()}
				</div>
				<p className="text-xs text-muted-foreground mt-1">
					Products in inventory
				</p>
			</CardContent>
		</Card>
	);
};
const TotalUsersCard = ({ totalUsers }) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Total Users
				</CardTitle>
				<Users className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-foreground">
					{totalUsers.toLocaleString()}
				</div>
				<p className="text-xs text-muted-foreground mt-1">
					All registered users
				</p>
			</CardContent>
		</Card>
	);
};
const TotalRevenueCard = ({ totalRevenue }) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Total Revenue
				</CardTitle>
				<DollarSign className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-foreground">
					$
					{totalRevenue.toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</div>
				<p className="text-xs text-muted-foreground mt-1">
					Total earnings
				</p>
			</CardContent>
		</Card>
	);
};
