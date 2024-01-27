import { combineReducers } from 'redux';

import userReducer from './userSlice';
import courseReducer from './courseSlice';
import authReducer from './authSlice';

export const rootReducer = combineReducers({
	user: userReducer,
	course: courseReducer,
	auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
