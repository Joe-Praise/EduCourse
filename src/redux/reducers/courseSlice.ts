import { SingleCourseType, courseType } from '../api/courseAPI';
import * as types from '../constants/courseConstants';
import { autocompleteType } from '../sharedTypes';

export type courseState = {
	filterState: boolean;
	course: courseType;
	singleCourse: SingleCourseType[];
	lectureCourse: SingleCourseType[];
	myLearning: courseType;
	autoComplete: autocompleteType[];
	myLearningAutoComplete: autocompleteType[];
	videoId: string;
	courseError: string;
	notification: [];
	queryFilter: {};
	loading: boolean;
};

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
	myLearning: {
		status: '',
		metaData: {
			totalPages: 0,
			totalDocuments: 0,
			page: 0,
			count: 0,
			limit: 0,
		},
		data: [],
	},
	autoComplete: [],
	myLearningAutoComplete: [],
	notification: [],
	videoId: '',
	loading: true,
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
				loading: false,
				course: payload,
			};
		case types.GET_COURSES_FAIL:
			return {
				...state,
				loading: true,
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
				loading: false,
				singleCourse: payload,
			};
		case types.GET_SINGLE_COURSE_FAIL:
			return {
				...state,
				loading: true,
				singleCourse: [],
			};
		case types.GET_LECTURE_COURSE_SUCCESS:
			return {
				...state,
				loading: false,
				lectureCourse: payload,
				videoId: handleVideoId(payload.modules),
			};
		case types.GET_LECTURE_COURSE_FAIL:
			return {
				...state,
				loading: true,
				lectureCourse: [],
			};
		case types.GET_MY_LEARNING_COURSE_SUCCESS:
			return {
				...state,
				loading: false,
				myLearning: payload,
			};
		case types.GET_MY_LEARNING_COURSE_FAIL:
			return {
				...state,
				loading: true,
				myLearning: [],
				notification: payload,
			};
		case types.RESET_MY_LEARNING_COURSE:
			return {
				...state,
				myLearning: [],
			};
		case types.CREATE_LECTURE_COURSE_SUCCESS:
			// TODO: TEST THIS TO SEE THE OUTCOME
			return {
				...state,
				loading: false,
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
				loading: true,
				notification: payload,
			};
		case types.GET_AUTO_COMPLETE_ALL_COURSE_SUCCESS:
			return {
				...state,
				loading: true,
				autoComplete: payload,
			};
		case types.GET_AUTO_COMPLETE_ALL_COURSE_FAIL:
			return {
				...state,
				loading: true,
				autoComplete: [],
			};
		case types.RESET_AUTO_COMPLETE_ALL_COURSE:
			return {
				...state,
				autoComplete: [],
			};
		case types.GET_AUTO_COMPLETE_MY_LEARNING_SUCCESS:
			return {
				...state,
				loading: false,
				myLearningAutoComplete: payload,
			};
		case types.GET_AUTO_COMPLETE_MY_LEARNING_FAIL:
			return {
				...state,
				loading: true,
				myLearningAutoComplete: [],
			};
		case types.RESET_AUTO_COMPLETE_MY_LEARNING:
			return {
				...state,
				myLearningAutoComplete: [],
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
		case types.SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case types.RESET_LOADING:
			return {
				...state,
				loading: false,
			};
		case types.RESET_NOTIFICATION:
			return {
				...state,
				notification: [],
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
