
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth.js";

export const commentApi = createApi({
	reducerPath: "commentApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Comment"],
	endpoints: builder => ({
		// GET comments for a specific post
		getComments: builder.query({
			query: productId => `/comments?productId=${productId}`,
			providesTags: [{ type: "Comment", id: "LIST" }]
		}),

		// POST a new comment
		addComment: builder.mutation({
			query: commentData => ({
				url: "/comments/add",
				method: "POST",
				body: commentData
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }]
		}),

		// DELETE a comment by ID
		deleteComment: builder.mutation({
			query: commentId => ({
				url: `/comments/${commentId}`,
				method: "DELETE"
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }]
		}),

		// get notifications by user
		getNotifications: builder.query({
			query: () => `/comments/notifications`,
			providesTags: [{ type: "Comment", id: "LIST" }]
		}),
		notificationRead: builder.mutation({
			query: id => ({
				url: `/comments/notification`,
				method: "PATCH",
				body: id
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }]
		})
	})
});

export const {
	useGetCommentsQuery,
	useGetNotificationsQuery,
	useNotificationReadMutation,
	useAddCommentMutation,
	useDeleteCommentMutation
} = commentApi;
