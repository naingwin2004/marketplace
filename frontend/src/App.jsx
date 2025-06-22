import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout.jsx";
import Home from "./layout/Home.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import OTPVerification from "./pages/auth/OTPVerification.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";

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
						<>
							<Home />
						</>
					),
				},
				{
					path: "/login",
					element: (
						<>
							<Login />
						</>
					),
				},
				{
					path: "/register",
					element: (
						<>
							<Register />
						</>
					),
				},
				{
					path: "/verifyEmail",
					element: (
						<>
							<OTPVerification />
						</>
					),
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
};

export default App;
