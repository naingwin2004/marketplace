import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emailSchema = z.object({
	to: z.string().email("Please enter a valid email address"),
	subject: z.string().min(1, "Subject is required"),
	message: z.string().min(1, "Message is required")
});

export default function EmailDialog({
	setOpen,
	email,
	productName,
	productLink
}) {
	const form = useForm({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			to: email || "",
			subject: productName ? `Interested in ${productName}` : "",
			message: ""
		}
	});

	function onSubmit(data) {
		const finalBody = `${data.message}\n\n---\n\nProduct Name : ${productName}\n Product Details Link : ${productLink}`;

		const mailtoUrl = `mailto:${encodeURIComponent(
			data.to
		)}?subject=${encodeURIComponent(
			data.subject
		)}&body=${encodeURIComponent(finalBody)}`;

		window.location.href = mailtoUrl;

		toast.success("Opening your email client...");

		form.reset();
		setOpen(false);
	}

	return (
		<div>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 justify-center">
						<Mail className="h-5 w-5" />
						Compose Private Email
					</DialogTitle>
					<DialogDescription>
						This will open your default email client (Gmail,
						Outlook, etc.)
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4">
						<FormField
							control={form.control}
							name="to"
							render={({ field }) => (
								<FormItem>
									<FormLabel>To</FormLabel>
									<FormControl>
										<Input
											placeholder="recipient@example.com"
											type="email"
											disabled={email}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Subject</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter email subject"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Message</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Type your message here..."
											className="min-h-[120px] resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" className="gap-2">
								<Send className="h-4 w-4" />
								Open Email Client
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</div>
	);
}
