import { combineReducers } from 'redux';

import userReducer from './userSlice';
import courseReducer from './courseSlice';

export const rootReducer = combineReducers({
	user: userReducer,
	course: courseReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
