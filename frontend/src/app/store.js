import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage"; // localStorage
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";

import { combineReducers } from "redux";

import authReducer from "./features/auth.js";
import { authApi } from "../services/auth.js";

// persist config
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"], // persist only 'auth' slice
};

// Combine all reducers
const rootReducer = combineReducers({
	auth: authReducer,
	[authApi.reducerPath]: authApi.reducer, // RTK Query API
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer and RTK Query middleware

export const store = configureStore({
	reducer: persistedReducer, // applie persisted
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {

				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}).concat(authApi.middleware),
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Create persistor for redux-persist
export const persistor = persistStore(store);
