import { combineReducers } from 'redux';

import userReducer from './userSlice';
import courseReducer from './courseSlice';
import authReducer from './authSlice';
import reviewReducer from './reviewSlice';
import categoryReducer from './categorySlice';
import instructorReducer from './instructorSlice';
import blogReducer from './blogSlice';
import tagReducer from './tagSlice';
import notificationReducer from './notification';
import publicProfileReducer from './publicProfileSlice';
import landingPageReducer from './landingPageSlice';

export const rootReducer = combineReducers({
	user: userReducer,
	course: courseReducer,
	auth: authReducer,
	review: reviewReducer,
	category: categoryReducer,
	instructor: instructorReducer,
	blog: blogReducer,
	tag: tagReducer,
	notification: notificationReducer,
	publicProfile: publicProfileReducer,
	landingPage: landingPageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
