// import { getLocalStorage } from '../../util/helperFunctions/helper';
import { getLocalStorage } from '../../util/helperFunctions/helper';
import { blogCommentResponseType, blogType } from '../api/blogApi';
import { SingleCourseType } from '../api/courseAPI';
import * as types from '../constants/blogConstants';
import { autocompleteType } from '../sharedTypes';

export type blogState = {
	filterState: boolean;
	blog: blogType;
	comments: blogCommentResponseType;
	singleBlog: SingleCourseType[];
	autoComplete: autocompleteType[];
	blogError: string;
	notification: [];
	queryFilter: {};
};

/**
 * TODO: Handle Error if fetching data does not work. Both single course and all courses
 */

const initialValue = {
	status: '',
	metaData: {
		totalDocuments: 0,
		page: 0,
		totalPages: 0,
		count: 0,
		limit: 0,
	},
	data: [],
};

const initialState: blogState = {
	filterState: false,
	queryFilter: {},
	blog: initialValue,
	comments: initialValue,
	singleBlog: [],
	autoComplete: [],
	blogError: '',
	notification: [],
};

const blogSlice = (state = initialState, action: any) => {
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
				blog: initialValue,
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
		// case types.GET_SINGLE_COURSE_REVIEWS_SUCCESS:
		// 	return {
		// 		...state,
		// 	};
		// case types.GET_SINGLE_COURSE_REVIEWS_FAIL:
		// 	return {
		// 		...state,
		// 	};
		case types.GET_BLOG_COMMENT_SUCCESS:
			return {
				...state,
				comments: payload,
				blogError: '',
			};
		case types.GET_BLOG_COMMENT_FAIL:
			return {
				...state,
				comments: {},
				blogError: payload,
			};
		case types.GET_AUTO_COMPLETE_ALL_BLOG_SUCCESS:
			return {
				...state,
				autoComplete: payload,
			};
		case types.GET_AUTO_COMPLETE_ALL_BLOG_FAIL:
			return {
				...state,
				autoComplete: [],
			};
		case types.CREATE_BLOG_COMMENT_SUCCESS:
			return {
				...state,
				comments: {
					...state.comments,
					metaData: {
						...state.comments.metaData,
						totalDocuments: state.comments.metaData.totalDocuments + 1,
						count: state.comments.metaData.count + 1,
					},
					data: [addImageToUser(payload), ...state.comments.data],
				},
				blogError: '',
			};
		case types.CREATE_BLOG_COMMENT_FAIL:
			return {
				...state,
				blogError: payload,
			};
		case types.DELETE_BLOG_COMMENT_SUCCESS:
			return {
				...state,
				comments: deleteHandler(state.comments, payload),
				blogError: '',
			};
		case types.DELETE_BLOG_COMMENT_FAIL:
			return {
				...state,
				blogError: payload,
			};

		// TODO: TEST THIS OUT
		case types.CREATE_BLOG_SUCCESS:
			return {
				...state,
				blog: payload,
				blogError: '',
			};
		case types.CREATE_BLOG_FAIL:
			return {
				...state,
				blogError: payload,
			};

		case types.SET_BLOG_QUERY_FILTER:
			return {
				...state,
				queryFilter: {
					...state.queryFilter,
					...payload,
				},
			};
		case types.REMOVE_BLOG_QUERY_FILTER:
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

const deleteHandler = (state: any, payload: any) => {
	const filteredArr = state.filter((item: any) => item._id !== payload._id);
	return filteredArr;
};

const addImageToUser = (payload: any) => {
	const payloadCopy = payload;
	payloadCopy.userId = getLocalStorage('profile')?.user;
	return payloadCopy;
};
export default blogSlice;
