import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_SERVER_URL}/auth`,
		prepareHeaders: (headers, { getState }) => {
			// check from redux store
			const token = getState().auth.token;

			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),

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
