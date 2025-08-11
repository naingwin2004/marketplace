import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout";
import Home from "./layout/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import OTPVerification from "./pages/auth/OTPVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProductDetails from "./pages/products/ProductDetails";
import AddProducts from "./pages/products/AddProducts";
import ManageProducts from "./pages/products/ManageProducts";
import UpdateImages from "./pages/products/UpdateImages";
import EditProduct from "./pages/products/EditProduct";
import Favorite from "./pages/products/Favorite";

import NotFoundPage from "./pages/NotFoundPage";
import Notifications from "./pages/Notifications";

import AdminManageProducts from "./pages/admin/AdminManageProducts";
import ManageUser from "./pages/admin/ManageUser";

import AuthProvider from "./provider/AuthProvider";

import {
	RedirectAuthenticatedUser,
	ProtectedUnverifiedOnly
} from "./provider/ProtectRoute";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			// errorElement: <NotFoundPage />,
			children: [
				{
					index: true,
					element: <Home />
				},
				{
					path: "/login",
					element: (
						<RedirectAuthenticatedUser>
							<Login />
						</RedirectAuthenticatedUser>
					)
				},
				{
					path: "/register",
					element: (
						<RedirectAuthenticatedUser>
							<Register />
						</RedirectAuthenticatedUser>
					)
				},
				{
					path: "/verifyEmail",
					element: (
						<AuthProvider>
							<ProtectedUnverifiedOnly>
								<OTPVerification />
							</ProtectedUnverifiedOnly>
						</AuthProvider>
					)
				},
				{
					path: "/forgot-password",
					element: (
						<>
							<ForgotPassword />
						</>
					)
				},
				{
					path: "/reset-password/:token",
					element: (
						<>
							<ResetPassword />
						</>
					)
				},
				{
					path: "/profile",
					element: (
						<AuthProvider>
							<Profile />
						</AuthProvider>
					)
				},
				{
					path: "/product/:id",
					element: (
						<AuthProvider>
							<ProductDetails />
						</AuthProvider>
					)
				},
				{
					path: "/add-product",
					element: (
						<AuthProvider>
							<AddProducts />
						</AuthProvider>
					)
				},
				{
					path: "/products",
					element: (
						<AuthProvider>
							<ManageProducts />
						</AuthProvider>
					)
				},
				{
					path: "/images/:id",
					element: (
						<AuthProvider>
							<UpdateImages />
						</AuthProvider>
					)
				},
				{
					path: "/edit-product/:id",
					element: (
						<AuthProvider>
							<EditProduct />
						</AuthProvider>
					)
				},
				{
					path: "/favorite",
					element: (
						<AuthProvider>
							<Favorite />
						</AuthProvider>
					)
				},
				{
					path: "/notifications",
					element: (
						<AuthProvider>
							<Notifications />
						</AuthProvider>
					)
				},
				{
					path: "/admin/products",
					element: (
						<AuthProvider>
							<AdminManageProducts />
						</AuthProvider>
					)
				},
				{
					path: "/admin/users",
					element: (
						<AuthProvider>
							<ManageUser />
						</AuthProvider>
					)
				},
			]
		}
	]);

	return <RouterProvider router={router} />;
};

export default App;
