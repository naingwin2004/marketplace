import { Outlet, useLocation } from "react-router-dom";

import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

import { ModeToggle } from "../components/mobile-toggle";


export default function Layout() {
	const location = useLocation();

	const path = location.pathname.split("/")[1];
	const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);

	return (
		<SidebarProvider defaultOpen={false}>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
					<SidebarTrigger className='-ml-1' />
					<Separator
						orientation='vertical'
						className='mr-2 h-4'
					/>
					<h1 className='text-lg font-semibold '>
						{location.pathname === "/" ? "Home" : capitalizedPath}
					</h1>
					<div className='ml-auto'>
						<ModeToggle />
					</div>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
