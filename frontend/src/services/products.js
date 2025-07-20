import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth.js";

export const productsApi = createApi({
	reducerPath: "productsApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Products", "Product", "Save"],

	endpoints: builder => ({
		publicProducts: builder.query({
			query: ({ page, waitSearchQuery, sortby, selectedCategory }) => {
				const params = new URLSearchParams();
				if (page) params.append("page", page);
				if (waitSearchQuery) params.append("search", waitSearchQuery);
				if (sortby) params.append("sortby", sortby);
				if (selectedCategory)
					params.append("category", selectedCategory);

				return {
					url: `/products/publicProducts?${params.toString()}`,
					method: "GET"
				};
			},
			providesTags: result =>
				result
					? [
							...result.products.map(({ _id }) => ({
								type: "Product",
								id: _id
							})),
							{ type: "Products", id: "LIST" }
					  ]
					: [{ type: "Products", id: "LIST" }]
		}),

		productDetails: builder.query({
			query: id => `/products/${id}`,
			providesTags: (result, error, id) => [{ type: "Product", id }]
		}),

		products: builder.query({
			query: ({ waitSearch, page = 1, status, category }) => {
				const params = new URLSearchParams();
				if (page) params.append("page", page);
				if (status) params.append("status", status);
				if (category) params.append("category", category);
				if (waitSearch) params.append("search", waitSearch);
				return {
					url: `/products?${params.toString()}`,
					method: "GET"
				};
			},
			providesTags: result =>
				result
					? [
							...result.products.map(({ _id }) => ({
								type: "Product",
								id: _id
							})),
							{ type: "Products", id: "LIST" }
					  ]
					: [{ type: "Products", id: "LIST" }]
		}),

		addProduct: builder.mutation({
			query: data => ({
				url: "/products/add",
				method: "POST",
				body: data
			}),
			invalidatesTags: [{ type: "Products", id: "LIST" }]
		}),

		deleteProduct: builder.mutation({
			query: id => ({
				url: `/products/${id}`,
				method: "DELETE"
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Product", id },
				{ type: "Products", id: "LIST" }
			]
		}),

		deleteImage: builder.mutation({
			query: ({ productId, imageId }) => {
				const params = new URLSearchParams();
				if (productId) params.append("productId", productId);
				if (imageId) params.append("imageId", imageId);
				return {
					url: `/products/delete-image?${params.toString()}`,
					method: "DELETE"
				};
			},
			invalidatesTags: (result, error, { productId }) => [
				{ type: "Product", id: productId }
			]
		}),

		updateImage: builder.mutation({
			query: ({ id, formData }) => ({
				url: `/products/${id}`,
				method: "POST",
				body: formData
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Product", id }
			]
		}),

		updateProduct: builder.mutation({
			query: data => ({
				url: `/products/update`,
				method: "POST",
				body: data
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Product", id }
			]
		}),

		saveProduct: builder.mutation({
			query: id => ({
				url: "/products/save",
				method: "POST",
				body: { id }
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Save", id: "LIST" }
			]
		}),

		getSaveProduct: builder.query({
			query: () => `/products/getSave`,
			providesTags: [{ type: "Save", id: "LIST" }]
		}),

		unSaveProduct: builder.mutation({
			query: id => ({
				url: "/products/unSave",
				method: "DELETE",
				body: { id }
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Save", id: "LIST" }
			]
		}),

		getImages: builder.query({
			query: id => `/products/images/${id}`,
			providesTags: (result, error, id) => [{ type: "Product", id }]
		}),

		getOldProduct: builder.query({
			query: id => `/products/oldProduct/${id}`,
			providesTags: (result, error, id) => [{ type: "Product", id }]
		})
	})
});

export const {
	usePublicProductsQuery,
	useProductDetailsQuery,
	useProductsQuery,
	useGetImagesQuery,
	useGetOldProductQuery,
	useGetSaveProductQuery,

	useAddProductMutation,
	useDeleteImageMutation,
	useDeleteProductMutation,
	useUpdateImageMutation,
	useUpdateProductMutation,
	useSaveProductMutation,
	useUnSaveProductMutation
} = productsApi;
