import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials,logout } from "../app/features/auth.js";

export const baseQueryWithReauth = async (args, api, extraOptions) => {
	const baseQuery = fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_SERVER_URL}/auth`,
		credentials: "include",
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token;
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	});

	let result = await baseQuery(args, api, extraOptions);

	// TokenExpired => call refreshToken api
	if (
		result?.error?.status === 403 &&
		result?.error?.data?.message === "TokenExpired"
	) {
		const refreshResult = await baseQuery(
			{ url: "/refreshToken", method: "POST" },
			api,
			extraOptions,
		);

		if (refreshResult?.data) {
			api.dispatch(
				setCredentials({ token: refreshResult.data?.newAccessToken }),
			);
			// retry origin
			result = await baseQuery(args, api, extraOptions);
		} else {
			// refresh failed => logout
			await baseQuery(
				{
					url: "/logout",
					method: "POST",
				},
				api,
				extraOptions,
			);
			api.dispatch(logout());
		}
	}

	return result;
};
