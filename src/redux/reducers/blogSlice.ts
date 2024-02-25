import { blogType } from '../api/blogApi';
import { SingleCourseType } from '../api/courseAPI';
import * as types from '../constants/blogConstants';

export type blogState = {
	filterState: boolean;
	blog: blogType;
	singleBlog: SingleCourseType[];
	blogError: string;
	notification: [];
	queryFilter: {};
};

/**
 * TODO: Handle Error if fetching data does not work. Both single course and all courses
 */

const initialState: blogState = {
	filterState: false,
	queryFilter: {},
	blog: {
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
	singleBlog: [],
	blogError: '',
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
		case types.GET_BLOGS_SUCCESS:
			return {
				...state,
				blog: payload,
			};
		case types.GET_BLOGS_FAIL:
			return {
				...state,
				blog: {
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
		case types.GET_SINGLE_BLOG_SUCCESS:
			return {
				...state,
				singleBlog: payload,
			};
		case types.GET_SINGLE_BLOG_FAIL:
			return {
				...state,
				singleBlog: [],
			};
		// TODO: TEST THIS OUT
		case types.CREATE_BLOG_SUCCESS:
			return {
				...state,
				blog: payload,
			};
		case types.CREATE_BLOG_FAIL:
			return {
				...state,
				blogError: payload.message,
			};
		// case types.GET_SINGLE_COURSE_REVIEWS_SUCCESS:
		// 	return {
		// 		...state,
		// 	};
		// case types.GET_SINGLE_COURSE_REVIEWS_FAIL:
		// 	return {
		// 		...state,
		// 	};

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
export default courseSlice;
