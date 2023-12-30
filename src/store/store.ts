import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
export const store = configureStore({
	reducer: {
		user: userReducer,
	},
});

// type script helper utility of the type of store.getState
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
