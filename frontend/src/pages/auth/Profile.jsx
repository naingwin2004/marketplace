import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Lock, Mail, Calendar, User } from "lucide-react";
import { GoogleIcon } from "@/components/GoogleIcon";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { useCheckAuthQuery } from "@/services/auth.js";
import EditProfile from "./EditProfile.jsx";
import ChangePassword from "./ChangePassword.jsx";

export default function ProfileCard() {
	const { data, error, isError } = useCheckAuthQuery();

	const [open, setOpen] = useState(false);
	const [changePassOpen, setChangePassOpen] = useState(false);

	const userData = data?.user;

	if (error?.error) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>{error?.status} : Please Check Your Internet</p>
			</div>
		);
	}
	if (error?.data) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>{error?.data?.message}</p>
			</div>
		);
	}

	return (
		<div className='h-full flex justify-center items-center'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<div className='flex flex-col items-center space-y-2'>
						<Badge
							variant='secondary'
							className='text-xs ml-auto'>
							{userData?.role.toUpperCase()}
						</Badge>
						<Avatar className='w-24 h-24'>
							<AvatarImage
								src={userData?.avatar.url || "/placeholder.svg"}
								alt={userData?.username}
							/>
							<AvatarFallback className='text-lg'>
								{" "}
								{userData?.username
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<h2 className='text-xl font-bold'>
								@{userData?.username}
							</h2>
						</div>
					</div>
					<div className='flex justify-center'>
						<span className='text-muted-foreground'>
							{userData?.bio || "Your bio here"}
						</span>
					</div>
				</CardHeader>

				<CardContent className='space-y-6'>
					{/* User Information */}
					<div className='space-y-4'>
						<div className='flex items-center space-x-3'>
							<User className='w-4 h-4 text-muted-foreground' />
							<div>
								<p className='text-sm font-medium'>Username</p>
								<p className='text-sm text-muted-foreground'>
									{userData?.username}
								</p>
							</div>
						</div>

						<div className='flex items-center space-x-3'>
							<Mail className='w-4 h-4 text-muted-foreground' />
							<div>
								<p className='text-sm font-medium'>Email</p>
								<p className='text-sm text-muted-foreground'>
									{userData?.email}
								</p>
							</div>
						</div>

						<div className='flex items-center space-x-3'>
							<Calendar className='w-4 h-4 text-muted-foreground' />
							<div>
								<p className='text-sm font-medium'>
									Created Date
								</p>
								<p className='text-sm text-muted-foreground'>
									{new Date(
										userData?.createdAt,
									).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						</div>

						{/* Google ID - only show if connected */}
						{userData?.googleId && (
							<div className='flex items-center space-x-3'>
								<GoogleIcon />

								<div>
									<p className='text-sm font-medium'>
										Google Account
									</p>
									<p className='text-sm text-muted-foreground'>
										Connected
									</p>
								</div>
							</div>
						)}
					</div>

					<Separator />

					{/* Action Buttons */}

					<div className='space-y-3'>
						<Dialog
							open={open}
							onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button
									className='w-full'
									variant='default'>
									<Edit className='w-4 h-4 mr-2' />
									EditProfile
								</Button>
							</DialogTrigger>
							<EditProfile setOpen={setOpen} />
						</Dialog>

						<Dialog
							open={changePassOpen}
							onOpenChange={setChangePassOpen}>
							<DialogTrigger asChild>
								<Button
									className='w-full bg-transparent'
									variant='outline'>
									<Lock className='w-4 h-4 mr-2' />
									Change Password
								</Button>
							</DialogTrigger>
							<ChangePassword
								setChangePassOpen={setChangePassOpen}
							/>
						</Dialog>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
