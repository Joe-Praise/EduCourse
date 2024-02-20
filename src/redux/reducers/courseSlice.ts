// import { createSlice } from '@reduxjs/toolkit';
import { SingleCourseType, courseType } from '../api/courseAPI';
import * as types from '../constants/courseConstants';
// type user = {
// 	name: string;
// 	email: string;
// 	photo: string;
// 	role: string;
// 	createdAt: string;
// };

export type courseState = {
	filterState: boolean;
	course: courseType;
	singleCourse: SingleCourseType[];
	lectureCourse: SingleCourseType[];
	courseError: string;
	notification: [];
};

/**
 * TODO: Handle Error if fetching data does not work. Both single course and all courses
 */

const initialState: courseState = {
	filterState: false,
	course: {
		status: '',
		metaData: {
			totalDocuments: 0,
			page: 0,
			totalPages: 0,
			count: 0,
			limit: 0,
		},
		data: [],
	},
	singleCourse: [],
	courseError: '',
	lectureCourse: [],
	notification: [],
};

const courseSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.SET_FILTER:
			return {
				...state,
				filterState: !state.filterState,
			};
		case types.GET_COURSES_SUCCESS:
			return {
				...state,
				course: payload,
			};
		case types.GET_COURSES_FAIL:
			return {
				...state,
				course: {
					status: '',
					metaData: {
						totalDocuments: 0,
						pageNumber: 0,
						totalPages: 0,
						count: 0,
					},
					data: [],
				},
			};
		case types.GET_SINGLE_COURSE_SUCCESS:
			return {
				...state,
				singleCourse: payload,
			};
		case types.GET_SINGLE_COURSE_FAIL:
			return {
				...state,
				singleCourse: [],
			};
		case types.GET_LECTURE_COURSE_SUCCESS:
			return {
				...state,
				lectureCourse: payload,
			};
		case types.GET_LECTURE_COURSE_FAIL:
			return {
				...state,
				lectureCourse: [],
			};
		case types.CREATE_LECTURE_COURSE_SUCCESS:
			return {
				...state,
				notification: payload,
			};
		case types.CREATE_LECTURE_COURSE_FAIL:
			return {
				...state,
				notification: payload,
			};

		default:
			return state;
	}
};

export default courseSlice;
