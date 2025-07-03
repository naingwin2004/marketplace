import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth.js";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth,

	endpoints: (builder) => ({
		login: builder.mutation({
			query: (payload) => ({
				url: "auth/login",
				method: "POST",
				body: payload,
			}),
		}),

		register: builder.mutation({
			query: (payload) => ({
				url: "auth/register",
				method: "POST",
				body: payload,
			}),
		}),

		logout: builder.mutation({
			query: () => ({
				url: "auth/logout",
				method: "POST",
			}),
		}),

		verifyEmail: builder.mutation({
			query: (data) => ({
				url: "auth/verifyEmail",
				method: "POST",
				body: data,
			}),
		}),

		resendOtp: builder.mutation({
			query: (email) => ({
				url: "auth/resendOtp",
				method: "POST",
				body: email,
			}),
		}),

		forgotPassword: builder.mutation({
			query: (email) => ({
				url: "auth/forgotPassword",
				method: "POST",
				body: email,
			}),
		}),

		resetPassword: builder.mutation({
			query: ({ token, values }) => ({
				url: `auth/resetPassword/${token}`,
				method: "POST",
				body: values,
			}),
		}),

		changePassword: builder.mutation({
			query: (payload) => ({
				url: "auth/changePassword",
				method: "POST",
				body: payload,
			}),
		}),

		updatedProfile: builder.mutation({
			query: (formData) => ({
				url: "auth/updatedProfile",
				method: "PATCH",
				body: formData,
			}),
		}),

		checkAuth: builder.query({
			query: () => "auth/checkAuth",
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useVerifyEmailMutation,
	useResendOtpMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useChangePasswordMutation,
	useUpdatedProfileMutation,

	useCheckAuthQuery,
	
} = authApi;
