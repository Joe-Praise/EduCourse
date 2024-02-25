import { combineReducers } from 'redux';

import userReducer from './userSlice';
import courseReducer from './courseSlice';
import authReducer from './authSlice';
import reviewReducer from './reviewSlice';
import categoryReducer from './categorySlice';
import instructorReducer from './instructorSlice';
import blogReducer from './blogSlice';

export const rootReducer = combineReducers({
	user: userReducer,
	course: courseReducer,
	auth: authReducer,
	review: reviewReducer,
	category: categoryReducer,
	instructor: instructorReducer,
	blog: blogReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
