import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate, Navigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { useCheckAuthQuery, useLogoutMutation } from "../services/auth.js";
import { updateUser, logout } from "../app/features/auth.js";

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { token, user } = useSelector((state) => state.auth);
	const isVerified = user?.isVerified;

	// Only call API if token exists
	const { data, error, isError, isLoading, isSuccess } = useCheckAuthQuery(
		token ? undefined : skipToken,
		{
			skip: !token,
		},
	);

	const [logoutApi] = useLogoutMutation();

	// Memoize logout function to prevent unnecessary re-renders
	const handleLogout = useCallback(async () => {
		try {
			await logoutApi();
		} catch (err) {
			// Ignore logout API errors
		} finally {
			dispatch(logout());
			navigate("/login", { replace: true });
		}
	}, [logoutApi, dispatch, navigate]);

	// Handle successful auth check
	useEffect(() => {
		if (isSuccess && data?.user) {
			dispatch(updateUser(data.user));
			// Only navigate to home if not already there and user is verified
			if (data.user.isVerified) {
				if (location.pathname !== "/") {
					navigate("/", { replace: true });
				}
			}
		}
	}, [isSuccess, data?.user, dispatch, navigate]);

	// Handle auth errors (invalid, etc.)
	useEffect(() => {
		if (isError && error) {
			if (error.status === 401) {
				toast.error(error?.data?.message || "Authentication failed");
				handleLogout();
			}
		}
	}, [isError, error, handleLogout]);

	// Handle navigation based on auth state
	useEffect(() => {
		// Don't redirect if currently loading
		if (isLoading) return;

		// No token - redirect to login
		if (!token) {
			if (location.pathname !== "/login") {
				navigate("/login", { replace: true });
			}
			return;
		}

		// Has token but not verified - redirect to verify email
		if (token && user && !isVerified) {
			if (location.pathname !== "/verifyEmail") {
				navigate("/verifyEmail", { replace: true });
			}
			return;
		}

		// Has token and verified - allow access to protected routes
		// Don't force redirect to home, let user stay on current page
	}, [token, user, isVerified, isLoading, navigate]);

	if (isLoading) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>Checking authentication...</p>
			</div>
		);
	}

	return children;
};

export default AuthProvider;
