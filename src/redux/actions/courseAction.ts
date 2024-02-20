import { NavigateFunction } from 'react-router-dom';
import { ThunkAction } from 'redux-thunk';
import * as api from '../api/courseAPI';
import * as types from '../constants/courseConstants';
import { AppDispatch, RootState } from '../store';

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

export const getCoursesAction =
	(details: api.paginateType): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getCourses(details);
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

export const getLectureCourseAction =
	(courseId: string): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			let data: any = {};
			const { data: courseData } = await api.getCourseBySlug(courseId);
			data.course = courseData;

			if (data?.course?._id) {
				const courseId = data?.course?._id;
				const { data: moduleData } = await api.getLectureModules(courseId);
				data.modules = moduleData;
			}

			dispatch({
				type: types.GET_LECTURE_COURSE_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_LECTURE_COURSE_FAIL,
				payload: error,
			});
		}
	};

export const createLectureCourseAction =
	(details: api.createLectureType, navigate: NavigateFunction): CourseThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createLectureCourse(details);
			const { error, data } = response;

			if (!error) {
				dispatch({
					type: types.CREATE_LECTURE_COURSE_SUCCESS,
					payload: data,
				});

				console.log(data);
			}
		} catch (error) {
			dispatch({
				type: types.CREATE_LECTURE_COURSE_FAIL,
				payload: error,
			});
		}
	};

export const setFilter = () => {
	return {
		type: types.SET_FILTER,
	};
};
