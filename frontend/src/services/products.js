import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth.js";

export const productsApi = createApi({
	reducerPath: "productsApi",
	baseQuery: baseQueryWithReauth,

	endpoints: (builder) => ({
		publicProducts: builder.query({
			query: () => ({
				url: "/products",
			}),
		}),
	}),
});

export const { usePublicProductsQuery } = productsApi;
