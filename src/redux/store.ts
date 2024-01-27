import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { thunk } from 'redux-thunk';
// import userReducer from './reducers/userSlice';
// import courseReducer from './reducers/courseSlice';

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
// type script helper utility of the type of store.getState

export type AppDispatch = typeof store.dispatch;
