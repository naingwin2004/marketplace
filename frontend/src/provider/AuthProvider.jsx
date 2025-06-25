import { useEffect } from "react";
import toast from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useCheckAuthQuery, useLogoutMutation } from "../services/auth.js";
import { updateUser, logout } from "../app/features/auth.js";

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = useSelector((state) => state.auth.token);
	const isVerified = useSelector((state) => state.auth?.user?.isVerified);

	const { data, error, isError, isLoading, isSuccess } = useCheckAuthQuery(
		token ? undefined : skipToken,
	);

	const [logoutApi] = useLogoutMutation();

	useEffect(() => {
		if (isSuccess && data?.user) {
			dispatch(updateUser(data.user));
			navigate("/");
		}
	}, [isSuccess, data, dispatch]);

	useEffect(() => {
		if (isError && error) {
			logoutApi();
			dispatch(logout());
			toast.error(error?.data?.message || "Failer");
			navigate("/login");
		}
	}, [isError, error, logoutApi]);

	useEffect(() => {
		if (!token) {
			navigate("/login");
		}
	}, [token, navigate]);

	useEffect(() => {
		if (isVerified === false) {
			navigate("/verifyEmail");
		}
	}, [isVerified, navigate]);

	if (isLoading) {
		return (
			<div className='h-full flex justify-center items-center'>
				Checking authentication...
			</div>
		);
	}

	return children;
};

export default AuthProvider;
