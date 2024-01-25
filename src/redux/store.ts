import { Tuple, configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { thunk } from 'redux-thunk';
// import userReducer from './reducers/userSlice';
// import courseReducer from './reducers/courseSlice';

export const store = configureStore({
	// reducer: {
	// 	user: userReducer,
	// 	course: courseReducer,
	// },
	reducer: rootReducer,
	middleware: () => new Tuple(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
// type script helper utility of the type of store.getState

export type AppDispatch = typeof store.dispatch;
