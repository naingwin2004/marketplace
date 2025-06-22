import { Link } from "react-router-dom";

import {
	PackagePlus,
	Boxes,
	BellRing,
	Heart,
	UserCog,
	LogIn,
	UserPlus,
	LogOut,
	Store,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

// Main navigation items
const mainNavItems = [
	{
		name: "Add Products",
		path: "/add-product",
		icon: PackagePlus,
	},
	{
		name: "Manage Products",
		path: "/products",
		icon: Boxes,
	},
	{
		name: "Notifications",
		path: "/notifications",
		icon: BellRing,
	},
	{
		name: "Favorite",
		path: "/favorite",
		icon: Heart,
	},
	{
		name: "Profile",
		path: "/profile",
		icon: UserCog,
	},
];

// Authentication items
const authItems = [
	{
		name: "Login",
		path: "/login",
		icon: LogIn,
	},
	{
		name: "Register",
		path: "/register",
		icon: UserPlus,
	},
];

export function AppSidebar() {
	const handleLogout = () => {
		alert("Logout clicked! Add your logout logic here.");
		console.log("Logging out...");
	};

	return (
		<Sidebar collapsible='icon'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size='lg'
							asChild>
							<Link to='/'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
									<Store className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>
										ECSB
									</span>
									<span className='truncate text-xs'>
										Easy Connect Seller Buyer
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupLabel>Main Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavItems.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<Link to={item.path}>
											<item.icon />
											<span>{item.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Authentication */}
				<SidebarGroup>
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{authItems.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<Link to={item.path}>
											<item.icon />
											<span>{item.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton onClick={handleLogout}>
							<LogOut />
							<span>Logout</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
