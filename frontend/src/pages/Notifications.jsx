import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useGetNotificationsQuery } from "../services/comment.js";

export default function Notifications() {
	const [notificationList, setNotificationList] = useState([]);

	const { data, error, isLoading } = useGetNotificationsQuery();

	const handleClick = id => {
		setNotificationList(prev =>
			prev.map(notif =>
				notif._id === id ? { ...notif, isRead: true } : notif
			)
		);
	};

	useEffect(() => {
		if (data) {
			setNotificationList(data);
		}
	}, [data]);

	if (isLoading) {
		return <div>Getting Notifications...</div>;
	}

	return (
		<div className="max-w-2xl mx-auto select-none w-full">
			{/* Notifications */}
			{notificationList.length === 0 && (
				<div className="text-center text-2xl font-bold">
					No Notifications
				</div>
			)}
			<div className="space-y-3">
				{notificationList.map(notification => (
					<Card
						key={notification._id}
						className={`cursor-pointer hover:shadow-md transition-shadow bg-secondary ${
							!notification.isRead
								? "border-l-4 border-l-blue-500"
								: ""
						}`}
						onClick={() => handleClick(notification._id)}>
						<CardContent className="p-4">
							<div className="flex items-start gap-3">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={notification.from.avatar.url}
										alt={notification.from.avatar.name}
									/>
									<AvatarFallback>
										{notification.from.username.charAt(0)}
									</AvatarFallback>
								</Avatar>

								<div className="flex-1">
									<div className="flex items-center justify-between mb-1">
										<h3 className="font-semibold ">
											{notification.from.username}
										</h3>

										<span className="text-xs">
											{formatDistanceToNow(
												new Date(
													notification.commentId.createdAt
												),
												{ addSuffix: true }
											)
												.replace("about ", "")
												.replace("minute", "min")
												.replace("second", "sec")}
										</span>
									</div>
									<p>{notification.commentId.content}</p>
								</div>

								{!notification.isRead && (
									<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
