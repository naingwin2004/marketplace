import { toast } from "sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
	LayoutDashboard,
	Users,
	PackageCheck
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
	SidebarRail
} from "@/components/ui/sidebar";

import { useLogoutMutation } from "@/services/auth.js";
import { logout } from "@/app/features/auth.js";

// Main navigation items
const mainNavItems = [
	{
		name: "Add Products",
		path: "/add-product",
		icon: PackagePlus
	},
	{
		name: "Manage Products",
		path: "/products",
		icon: Boxes
	},
	{
		name: "Notifications",
		path: "/notifications",
		icon: BellRing
	},
	{
		name: "Favorite",
		path: "/favorite",
		icon: Heart
	},
	{
		name: "Profile",
		path: "/profile",
		icon: UserCog
	}
];

// Authentication items
const authItems = [
	{
		name: "Login",
		path: "/login",
		icon: LogIn
	},
	{
		name: "Register",
		path: "/register",
		icon: UserPlus
	}
];

// Admin items

const adminItems = [
	{
		name: "Dashboard",
		path: "/dashboard",
		icon: LayoutDashboard
	},
	{
		name: "Manage User",
		path: "/admin/users",
		icon: Users
	},
	{
		name: "Admin Manage Products",
		path: "/admin/products",
		icon: PackageCheck
	}
];

export function AppSidebar() {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const token = useSelector(state => state.auth.token);
	const user = useSelector(state => state.auth.user);

	const [logoutMutation] = useLogoutMutation();

	const handleLogout = async () => {
		try {
			const res = await logoutMutation().unwrap();
			dispatch(logout());
			toast.success(res?.message || "Logged out successfully");
			navigate("/login", { replace: true });
		} catch (err) {
			console.error("Logout error:", err);
			toast.error(err.data?.message || "Failed to logout");
		}
	};

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Store className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										ECSB
									</span>
									<span className="truncate text-xs">
										Easy Connect Seller Buyer
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{/* Admin Navigation */}
				{user?.role === "admin" && token && (
					<SidebarGroup>
						<SidebarGroupLabel>Admin Pendle</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{adminItems.map(item => (
									<SidebarMenuItem key={item?.name}>
										<SidebarMenuButton
											asChild
											isActive={
												location.pathname === item.path
											}>
											<Link to={item?.path}>
												<item.icon size={16} />
												<span>{item?.name}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}

				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupLabel>Main Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavItems.map(item => (
								<SidebarMenuItem key={item?.name}>
									{!token ? (
										<SidebarMenuButton
											disabled={true}
											isActive={
												location.pathname === item.path
											}>
											<Link
												to={item?.path}
												className="flex items-center space-x-2">
												<item.icon size={16} />
												<span>{item?.name}</span>
											</Link>
										</SidebarMenuButton>
									) : (
										<SidebarMenuButton
											asChild
											isActive={
												location.pathname === item.path
											}>
											<Link to={item?.path}>
												<item.icon size={16} />
												<span>{item?.name}</span>
											</Link>
										</SidebarMenuButton>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Authentication */}
				{!token && (
					<SidebarGroup>
						<SidebarGroupLabel>Account</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{authItems.map(item => (
									<SidebarMenuItem key={item?.name}>
										<SidebarMenuButton
											asChild
											isActive={
												location.pathname === item.path
											}>
											<Link
												to={item?.path}
												className="flex space-x-2">
												<item.icon size={16} />
												<span>{item?.name}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>

			{token && (
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
			)}
		</Sidebar>
	);
}
