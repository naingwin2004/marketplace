import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token:  null,
	user:  null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			const { token, user } = action.payload;
			state.token = token;
			state.user = user;
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
			
		},
		updateUser: (state, action) => {
			state.user = {
				...state.user,
				...action.payload,
			};
		},
	},
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
