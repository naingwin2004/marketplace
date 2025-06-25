import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout.jsx";
import Home from "./layout/Home.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import OTPVerification from "./pages/auth/OTPVerification.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";

import AuthProvider from "./provider/AuthProvider";
import { RedirectAuthenticatedUser,ProtectedUnverifiedOnly } from "./provider/ProtectRoute.jsx";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			errorElement: <NotFoundPage />,
			children: [
				{
					index: true,
					element: (
						<AuthProvider>
							<Home />
						</AuthProvider>
					),
				},
				{
					path: "/login",
					element: (
						<RedirectAuthenticatedUser>
							<Login />
						</RedirectAuthenticatedUser>
					),
				},
				{
					path: "/register",
					element: (
						<RedirectAuthenticatedUser>
							<Register />
						</RedirectAuthenticatedUser>
					),
				},
				{
					path: "/verifyEmail",
					element: (
						<ProtectedUnverifiedOnly>
							<OTPVerification />
						</ProtectedUnverifiedOnly>
					),
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
};

export default App;
