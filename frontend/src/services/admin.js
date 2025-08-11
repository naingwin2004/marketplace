import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth.js";

export const adminApi = createApi({
	reducerPath: "adminApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["AdminProducts"],
	endpoints: builder => ({
		getProducts: builder.query({
			query: ({ waitSearch, page = 1, status, category }) => {
				const params = new URLSearchParams();
				if (page) params.append("page", page);
				if (status) params.append("status", status);
				if (category) params.append("category", category);
				if (waitSearch) params.append("search", waitSearch);
				return {
					url: `/admin/products?${params.toString()}`,
					method: "GET"
				};
			},
			providesTags: ["AdminProducts"]
		}),

		updateProductStatus: builder.mutation({
			query: ({ id, status }) => ({
				url: `/admin/product/${id}`,
				body: { status },
				method: "PUT"
			}),
			invalidatesTags: ["AdminProducts"]
		})
	})
});

export const { useGetProductsQuery, useUpdateProductStatusMutation } = adminApi;
