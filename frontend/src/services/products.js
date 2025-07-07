import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth.js";

export const productsApi = createApi({
	reducerPath: "productsApi",
	baseQuery: baseQueryWithReauth,

	endpoints: (builder) => ({
		publicProducts: builder.query({
			query: ({ page, waitSearchQuery, sortby, selectedCategory }) => {
				const params = new URLSearchParams();
				if (page) params.append("page", page);
				if (waitSearchQuery) params.append("search", waitSearchQuery);
				if (sortby) params.append("sortby", sortby);
				if (selectedCategory)
					params.append("category", selectedCategory);

				return {
					url: `/products?${params.toString()}`,
					method: "GET",
				};
			},
		}),

		productDetails: builder.query({
			query: (id) => `/products/${id}`,
		}),
	}),
});

export const { usePublicProductsQuery, useProductDetailsQuery } = productsApi;
