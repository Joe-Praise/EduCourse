import { SingleCourseType, courseType } from '../api/courseAPI';
import * as types from '../constants/courseConstants';

export type courseState = {
	filterState: boolean;
	course: courseType;
	singleCourse: SingleCourseType[];
	lectureCourse: SingleCourseType[];
	videoId: string;
	courseError: string;
	notification: [];
	queryFilter: {};
};

/**
 * TODO: Handle Error if fetching data does not work. Both single course and all courses
 */

const initialState: courseState = {
	filterState: false,
	queryFilter: {},
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
	videoId: '',
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
				videoId: handleVideoId(payload.modules),
			};
		case types.GET_LECTURE_COURSE_FAIL:
			return {
				...state,
				lectureCourse: [],
			};
		case types.CREATE_LECTURE_COURSE_SUCCESS:
			// TODO: TEST THIS TO SEE THE OUTCOME
			return {
				...state,
				// course: {
				// 	...state.course,
				// 	metaData: {
				// 		...state.course.metaData,
				// 		totalDocuments: state.course.metaData.totalDocuments + 1,
				// 		count: state.course.metaData.count + 1,
				// 	},
				// 	data: [...state.course.data, payload],
				// },
				notification: payload,
			};
		case types.CREATE_LECTURE_COURSE_FAIL:
			return {
				...state,
				notification: payload,
			};
		case types.SET_QUERY_FILTER:
			return {
				...state,
				queryFilter: {
					...state.queryFilter,
					...payload,
				},
			};
		case types.REMOVE_QUERY_FILTER:
			return {
				...state,
				queryFilter: removeQueryFilter(state.queryFilter, payload),
			};
		case types.SET_VIDEO_ID:
			return {
				...state,
				videoId: payload,
			};
		case types.REMOVE_VIDEO_ID:
			return {
				...state,
				videoId: '',
			};
		default:
			return state;
	}
};

const removeQueryFilter = (state: any, payload: any) => {
	const details = Object.keys(state)
		.filter((objKey) => objKey !== Object.keys(payload)[0])
		.reduce((newObj: any, key: any) => {
			newObj[key] = state[key];
			return newObj;
		}, {});
	return details;
};

const handleVideoId = (modules: any) => {
	const videoId = modules[0]?.lessons[0]?.url;

	// TODO: write algorithm to find the last video played and play the next one after it
	return videoId;
};
export default courseSlice;
