import { NavigateFunction } from 'react-router-dom';
import { ThunkAction } from 'redux-thunk';
import * as api from '../api/courseAPI';
import * as types from '../constants/courseConstants';
import { AppDispatch, RootState } from '../store';
import { obj, paginateType } from '../sharedTypes';
import {
	dispatchErrorHandler,
	dispatchSuccessHandler,
	getLocalStorage,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';

type GetCoursesSuccessAction = {
	type: typeof types.GET_COURSES_SUCCESS;
	payload: any;
};

type GetCoursesFailAction = {
	type: typeof types.GET_COURSES_FAIL;
	payload: any;
};

export type CourseActionTypes = GetCoursesSuccessAction | GetCoursesFailAction;

export type AppDispatchType = AppDispatch;

export type CourseThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	CourseActionTypes
>;

export interface paramsType {
	slug: string;
	id: string;
}

export interface lectureCourseType {
	courseId: string;
	userId: string;
}

// module type
export interface ModuleType {
	_id: string;
	courseId: string;
	title: string;
	moduleIndex: number;
	section: string;
	lessons: Lesson[];
	createdAt: string;
	updatedAt: string;
}

export interface Lesson {
	_id: string;
	moduleId: string;
	courseId: string;
	url: string;
	title: string;
	description: string;
	duration: string;
	lessonIndex: number;
	createdAt: string;
	updatedAt: string;
}

export const getCoursesAction =
	(details: paginateType, queryString: string = ''): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getCourses(details, queryString);
			const { error } = response;
			throwErrorHandler(error);

			dispatch({
				type: types.GET_COURSES_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);

			// dispatch({
			// 	type: types.GET_COURSES_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const getSingleCourseAction =
	(slug: any): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			// Reset state for the new slug — clears previous course + previous error,
			// puts the slice into a clean loading state.
			dispatch({ type: types.RESET_SINGLE_COURSE });
			const userId = getLocalStorage('profile')?.user?._id;
			let data: any = {};
			const {
				error,
				data: courseData,
				isEnrolled,
			} = await api.getCourseBySlug(slug, userId);

			throwErrorHandler(error);

			data.isEnrolled = isEnrolled;
			data.course = courseData?.[0] ?? {};

			if (data?.course?._id) {
				const courseId = data?.course?._id;
				const { data: moduleData } = await api.getCourseModules(courseId);
				data.modules = moduleData;
			}

			dispatch({
				type: types.GET_SINGLE_COURSE_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			dispatch({
				type: types.GET_SINGLE_COURSE_FAIL,
				payload: error.message,
			});
		}
	};

export const getLectureCourseAction =
	(details: api.LectureCourseType): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			let data: any = {};
			const response = await api.getLectureCourse(details);
			const { error, data: courseData } = response;

			throwErrorHandler(error);

			data.course = courseData?.[0] ?? {};

			if (data?.course?._id) {
				const courseId = data?.course?._id;
				const { data: moduleData } = await api.getCourseModules(courseId);
				data.modules = moduleData;
			}

			dispatch({
				type: types.GET_LECTURE_COURSE_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			dispatch({
				type: types.GET_LECTURE_COURSE_FAIL,
				payload: error.message,
			});
		}
	};

/**
 * Toggle a lesson's "completed" state for the current lecture course.
 * Optimistic — updates local state immediately so the UI (rail check marks,
 * header progress ring) updates without waiting for the server roundtrip.
 * If the PATCH fails, dispatches an error toast but does NOT revert — the
 * next page load will resync from the source of truth.
 */
export const markLessonCompleteAction =
	(completedCourseId: string, lessonId: string): CourseThunk =>
	async (dispatch: AppDispatch) => {
		// Optimistic local update first
		dispatch({ type: types.MARK_LESSON_COMPLETE_LOCAL, payload: lessonId });
		if (!completedCourseId) return;
		try {
			const response = await api.markLessonComplete(completedCourseId, lessonId);
			throwErrorHandler(response.error);
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
		}
	};

export const createLectureCourseAction =
	(
		details: api.LectureCourseType,
		navigate: NavigateFunction,
		params: paramsType
	): CourseThunk =>
	async (dispatch: AppDispatch) => {
		const { slug, id } = params;
		try {
			const { createEnrollmentApi } = await import('../api/enrollmentApi');
			const response = await createEnrollmentApi({ userId: details.userId ?? '', courseId: details.courseId });
			const { error, data } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.CREATE_LECTURE_COURSE_SUCCESS,
				payload: data,
			});

			dispatchSuccessHandler(dispatch, 'Successful Enrollment!');

			// routes to the learn course page
			navigate(`/courses/${slug}/lecture/${id}`);
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			navigate(`/signin`);
		}
	};

export const getMyLearningCourseAction =
	(
		details: paginateType,
		userId: string,
		queryString: string = ''
	): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			// dispatch({
			// 	type: types.RESET_MY_LEARNING_COURSE,
			// });
			// let query: any = {};
			dispatch(resetNotification());
			const response = await api.getMyLearningCourse(
				details,
				userId,
				queryString
			);
			const { error } = response;

			throwErrorHandler(error);

			// query.course = courseData?.[0] ?? {};

			// if (data?.course?._id) {
			// 	const courseId = data?.course?._id;
			// 	const { data: moduleData } = await api.getCourseModules(courseId);
			// 	data.modules = moduleData;
			// }

			// console.log('coming from api function', response);

			dispatch({
				type: types.GET_MY_LEARNING_COURSE_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			// console.log('error');
			// handleError(error.message, dispatch);
			dispatchErrorHandler(dispatch, error.message);
			dispatch({
				type: types.GET_MY_LEARNING_COURSE_FAIL,
				payload: error.message,
			});
		}
	};

export const getAutoCompleteAllCourseAction =
	(queryString: string): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			// let query: any = {};
			const response = await api.getAutoCompleteAllCourse(queryString);
			const { error, data } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_AUTO_COMPLETE_ALL_COURSE_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatch({
				type: types.GET_AUTO_COMPLETE_ALL_COURSE_FAIL,
				payload: error.message,
			});
		}
	};

export const getAutoCompleteMyLearningAction =
	(queryString: string): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			dispatch(resetNotification());
			const response = await api.getAutoCompleteMyLearning(queryString);
			const { error, data } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_AUTO_COMPLETE_MY_LEARNING_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatch({
				type: types.GET_AUTO_COMPLETE_MY_LEARNING_FAIL,
				payload: error.message,
			});
		}
	};

export const resetAutoCompleteAction = () => {
	return {
		type: types.RESET_AUTO_COMPLETE_ALL_COURSE,
	};
};

export const resetMyLearningAutoCompleteAction = () => {
	return {
		type: types.RESET_AUTO_COMPLETE_MY_LEARNING,
	};
};

export const resetMyLearningCourses = () => {
	return {
		type: types.RESET_MY_LEARNING_COURSE,
	};
};

export const setFilter = () => {
	return {
		type: types.SET_FILTER,
	};
};

export const setQueryFilterAction = (filter: obj) => {
	return {
		type: types.SET_QUERY_FILTER,
		payload: filter,
	};
};

export const removeQueryFilterAction = (filter: obj) => {
	return {
		type: types.REMOVE_QUERY_FILTER,
		payload: filter,
	};
};

export const setMyLearningQueryFilterAction = (filter: obj) => {
	return {
		type: types.SET_MY_LEARNING_QUERY_FILTER,
		payload: filter,
	};
};

export const removeMyLearningQueryFilterAction = (filter: obj) => {
	return {
		type: types.REMOVE_MY_LEARNING_QUERY_FILTER,
		payload: filter,
	};
};

export const setVideoId = (videoId: string) => {
	return {
		type: types.SET_VIDEO_ID,
		payload: videoId,
	};
};

export const removeVideoId = () => {
	return {
		type: types.REMOVE_VIDEO_ID,
	};
};

export const setLoadingAction = () => {
	return {
		type: types.SET_LOADING,
	};
};
export const resetLoadingAction = () => {
	return {
		type: types.RESET_LOADING,
	};
};

export const resetNotification = () => {
	return {
		type: types.RESET_NOTIFICATION,
	};
};
