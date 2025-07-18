import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout.jsx";
import Home from "./layout/Home.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Profile from "./pages/auth/Profile.jsx";
import OTPVerification from "./pages/auth/OTPVerification.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import ProductDetails from "./pages/products/ProductDetails";
import AddProducts from "./pages/products/AddProducts";
import ManageProducts from "./pages/products/ManageProducts";
import UpdateImages from "./pages/products/UpdateImages";
import EditProduct from "./pages/products/EditProduct";

import NotFoundPage from "./pages/NotFoundPage.jsx";

import AuthProvider from "./provider/AuthProvider";

import {
	RedirectAuthenticatedUser,
	ProtectedUnverifiedOnly
} from "./provider/ProtectRoute.jsx";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			/*	errorElement: <NotFoundPage />,*/
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
						<>
							<ProductDetails />
						</>
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
				}
			]
		}
	]);

	return <RouterProvider router={router} />;
};

export default App;
