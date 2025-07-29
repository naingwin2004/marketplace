import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Trash, Mail } from "lucide-react";
import EmailDialog from "./EmailDialog";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
	useAddCommentMutation,
	useGetCommentsQuery,
	useDeleteCommentMutation
} from "@/services/comment.js";

const commentSchema = z.object({
	content: z.string().min(3, "Context too short").max(200, "Context too long")
});

export default function CommentSection({ id, email, product }) {
	const [showComments, setShowComments] = useState(false);
	const [comments, setComments] = useState([]);
	const [open, setOpen] = useState(false);
	const userId = useSelector(state => state.auth?.user?._id);

	const { data, isFetching } = useGetCommentsQuery(product._id);

	const [addCommentMutation, { isLoading }] = useAddCommentMutation();

	const [deleteCommentMutation, { isLoading: deletingComment }] =
		useDeleteCommentMutation();

	const form = useForm({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: ""
		}
	});

	const onSubmit = async data => {
		const body = {
			...data,
			productId: product._id
		};

		try {
			const res = await addCommentMutation(body).unwrap();
			toast.success(res.message || "success");
		} catch (err) {
			console.error(err);
			toast.error(err.data.message || "comment fail");
		} finally {
			form.reset();
		}
	};

	const handleDelete = async id => {
		try {
			const res = await deleteCommentMutation(id).unwrap();
			toast.success(res.message || "success");
			setComments(comments.filter(c => c._id !== id));
		} catch (err) {
			console.error(err);
			toast.error(err.data.message || "delete fail");
		}
	};

	useEffect(() => {
		if (data) {
			setComments(data);
		}
	}, [data]);

	return (
		<div className="w-full space-y-4">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button className="w-full">
						<Mail className="h-4 w-4" />
						Compose Private Email
					</Button>
				</DialogTrigger>
				<EmailDialog
					setOpen={setOpen}
					email={email}
					productName={product.name}
					productLink={`http://localhost:5173/product/${product._id}`}
				/>
			</Dialog>

			<>
				{userId !== id && (
					<Card>
						<CardContent className="p-4">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-3">
									<FormField
										control={form.control}
										name="content"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder="Write your comment..."
														className="min-h-[100px] resize-none"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex justify-end gap-2">
										<Button
											variant="ghost"
											type="button"
											onClick={() => form.reset()}>
											Cancel
										</Button>
										<Button
											type="submit"
											disabled={isLoading}>
											Post Comment
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				)}

				{isFetching && <p>Fetching comment... </p>}
				{/* Comments Section */}
				{comments.map(comment => (
					<Card key={comment._id}>
						<CardContent className="p-4">
							<div className="flex items-start gap-3">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={comment?.userId.avatar.url}
										alt={comment?.userId.avatar.name}
									/>
									<AvatarFallback>
										{comment?.userId.username.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="space-y-2 flex-1">
									<div className="flex items-center justify-between mb-1">
										<span className="font-medium text-sm">
											{comment?.userId.username}
										</span>
										<span className="text-muted-foreground text-xs">
											{formatDistanceToNow(
												new Date(comment?.createdAt),
												{ addSuffix: true }
											)
												.replace("about ", "")
												.replace("minute", "min")
												.replace("second", "sec")}
										</span>
									</div>
									<p className="text-sm">
										{comment?.content}
									</p>
								</div>
							</div>
						</CardContent>
						{comment.userId._id === userId && (
							<CardFooter className="flex justify-end">
								<Button
									variant="destructive"
									size="icon"
									disabled={deletingComment}
									onClick={() => handleDelete(comment._id)}>
									<Trash size={18} />
								</Button>
							</CardFooter>
						)}
					</Card>
				))}
			</>
		</div>
	);
}
