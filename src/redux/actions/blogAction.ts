import { ThunkAction } from 'redux-thunk';
import * as api from '../api/blogApi';
import * as types from '../constants/blogConstants';
import { AppDispatch, RootState } from '../store';
import { obj, paginateType } from '../sharedTypes';
import {
	dispatchErrorHandler,
	dispatchSuccessHandler,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';

type GetBlogsSuccessAction = {
	type: typeof types.GET_BLOGS_SUCCESS;
	payload: any;
};

type GetBlogsFailAction = {
	type: typeof types.GET_BLOGS_FAIL;
	payload: any;
};

type CreateBlogCommentSuccessAction = {
	type: typeof types.CREATE_BLOG_COMMENT_SUCCESS;
	payload: any;
};
type CreateBlogCommentFailAction = {
	type: typeof types.CREATE_BLOG_COMMENT_FAIL;
	payload: any;
};
type GetBlogCommentSuccessAction = {
	type: typeof types.GET_BLOG_COMMENT_SUCCESS;
	payload: any;
};

type GetBlogCommentFailAction = {
	type: typeof types.GET_BLOG_COMMENT_FAIL;
	payload: any;
};

type DeleteBlogCommentSuccessAction = {
	type: typeof types.DELETE_BLOG_COMMENT_SUCCESS;
	payload: any;
};

type DeleteBlogCommentFailAction = {
	type: typeof types.DELETE_BLOG_COMMENT_FAIL;
	payload: any;
};

export type BlogActionTypes =
	| GetBlogsSuccessAction
	| GetBlogsFailAction
	| CreateBlogCommentSuccessAction
	| CreateBlogCommentFailAction
	| GetBlogCommentSuccessAction
	| GetBlogCommentFailAction
	| DeleteBlogCommentSuccessAction
	| DeleteBlogCommentFailAction;

export type AppDispatchType = AppDispatch;

export type BlogThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	BlogActionTypes
>;

export interface paramsType {
	slug: string;
	id: string;
}

export const getBlogsAction =
	(details: paginateType, queryString: string = ''): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getBlogs(details, queryString);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_BLOGS_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_BLOGS_FAIL,
			// 	payload: error.message,
			// });
		}
	};

/**
 *
 * @param slug - this is derived from the title(Backend)
 * @returns uses the slug of the item to query a single item not the ID
 */
export const getSingleBlogAction =
	(slug: any): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			dispatch({
				type: types.GET_SINGLE_BLOG_FAIL,
			});
			let data: any = {};
			const { error, data: blogData } = await api.getBlogBySlug(slug);

			throwErrorHandler(error);

			data = blogData?.[0] ?? {};

			dispatch({
				type: types.GET_SINGLE_BLOG_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_SINGLE_BLOG_FAIL,
			// 	payload: error.message,
			// });
		}
	};

// TODO: check the type and adjust according to the expcted type
export const createBlogAction =
	(details: api.singleBlogType): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createBlog(details);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.CREATE_BLOG_SUCCESS,
				payload: response,
			});
			dispatchSuccessHandler(dispatch, 'Successfully Created!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.CREATE_BLOG_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const getAutoCompleteAllBlogAction =
	(queryString: string): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getAutoCompleteAllBlog(queryString);
			const { error, data } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_AUTO_COMPLETE_ALL_BLOG_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_AUTO_COMPLETE_ALL_BLOG_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const createBlogCommentAction =
	(details: api.commentRequestType, blogId: string): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createBlogComment(details, blogId);
			const { error, data } = response;

			if (error) {
				// TODO: Have notification reducer to handle all notifications
				// console.log(error);
				throw new Error(error);
			}
			// console.log('createBlogCommentAction', response);
			dispatch({
				type: types.CREATE_BLOG_COMMENT_SUCCESS,
				payload: data,
			});

			dispatchSuccessHandler(dispatch, 'Successfully Created!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.CREATE_BLOG_COMMENT_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const getBlogCommentsAction =
	(details: paginateType, blogId: string): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getBlogComments(details, blogId);

			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_BLOG_COMMENT_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_BLOG_COMMENT_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const deleteBlogCommentsAction =
	(blogId: string): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const { error, data } = await api.deleteBlogComments(blogId);

			throwErrorHandler(error);
			dispatch({
				type: types.DELETE_BLOG_COMMENT_SUCCESS,
				payload: data,
			});

			dispatchSuccessHandler(dispatch, 'Successfully Deleted!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.DELETE_BLOG_COMMENT_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const resetAutoCompleteAction = () => {
	return {
		type: types.GET_AUTO_COMPLETE_ALL_BLOG_FAIL,
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

export const setFilter = () => {
	return {
		type: types.SET_FILTER,
	};
};
