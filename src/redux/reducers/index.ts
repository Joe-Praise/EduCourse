import { combineReducers } from 'redux';

import userReducer from './userSlice';
import courseReducer from './courseSlice';
import authReducer from './authSlice';
import reviewReducer from './reviewSlice';

export const rootReducer = combineReducers({
	user: userReducer,
	course: courseReducer,
	auth: authReducer,
	review: reviewReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
