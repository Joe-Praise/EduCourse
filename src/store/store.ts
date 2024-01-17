import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import courseReducer from './course/courseSlice';
export const store = configureStore({
	reducer: {
		user: userReducer,
		course: courseReducer,
	},
});

// type script helper utility of the type of store.getState
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
