import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth.js";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth,

	endpoints: (builder) => ({
		login: builder.mutation({
			query: (payload) => ({
				url: "/login",
				method: "POST",
				body: payload,
			}),
		}),

		register: builder.mutation({
			query: (payload) => ({
				url: "/register",
				method: "POST",
				body: payload,
			}),
		}),

		logout: builder.mutation({
			query: () => ({
				url: "/logout",
				method: "POST",
			}),
		}),

		verifyEmail: builder.mutation({
			query: (data) => ({
				url: "/verifyEmail",
				method: "POST",
				body: data,
			}),
		}),

		resendOtp: builder.mutation({
			query: (email) => ({
				url: "/resendOtp",
				method: "POST",
				body: email,
			}),
		}),

		checkAuth: builder.query({
			query: () => "/checkAuth",
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useVerifyEmailMutation,
	useResendOtpMutation,

	useCheckAuthQuery,
} = authApi;
