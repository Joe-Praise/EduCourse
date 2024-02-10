import { ThunkAction } from 'redux-thunk';
import * as api from '../api/courseAPI';
import * as types from '../constants/courseConstants';
import { AppDispatch, RootState } from '../store';

type GetCoursesSuccessAction = {
	type: typeof types.GET_COURSES_SUCCESS;
	payload: any; // Adjust the payload type accordingly
};

type GetCoursesFailAction = {
	type: typeof types.GET_COURSES_FAIL;
	payload: any; // Adjust the payload type accordingly
};

export type CourseActionTypes = GetCoursesSuccessAction | GetCoursesFailAction;

export type AppDispatchType = AppDispatch;

export type CourseThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	CourseActionTypes
>;
// type SignInSuccessAction = {
// 	type: typeof types.SIGNIN_SUCCESS;
// 	payload: any; // Adjust the payload type accordingly
// };

// type SignInFailAction = {
// 	type: typeof types.SIGNIN_FAIL;
// 	payload: any; // Adjust the payload type accordingly
// };

// type RefreshTokenFail = {
// 	type: typeof types.REFRESH_TOKEN_FAIL;
// 	payload: any;
// };

export const getCoursesAction =
	(details: api.paginateType): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getCourses(details.page, details.limit);
			const data = response;

			dispatch({
				type: types.GET_COURSES_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_COURSES_FAIL,
				payload: error,
			});
		}
	};

export const getSingleCourseAction =
	(slug: any): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			let data: any = {};
			const { data: courseData } = await api.getCourseBySlug(slug);
			data.course = courseData[0];

			if (data?.course?._id) {
				const courseId = data?.course?._id;
				const { data: moduleData } = await api.getCourseModules(courseId);
				data.modules = moduleData;

				// const { data: reviewData } = await api.getCourseReviews(courseId);
				// data.reviews = reviewData;
			}

			dispatch({
				type: types.GET_SINGLE_COURSE_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_SINGLE_COURSE_FAIL,
				payload: error,
			});
		}
	};

export const setFilter = () => {
	return {
		type: types.SET_FILTER,
	};
};
