import { ThunkAction } from 'redux-thunk';
import * as api from '../api/blogApi';
import * as types from '../constants/blogConstants';
import { AppDispatch, RootState } from '../store';
import { obj, paginateType } from '../sharedTypes';

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
			const data = response;

			dispatch({
				type: types.GET_BLOGS_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_BLOGS_FAIL,
				payload: error,
			});
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
			let data: any = {};
			const { data: courseData } = await api.getBlogBySlug(slug);
			data = courseData[0];

			dispatch({
				type: types.GET_SINGLE_BLOG_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_SINGLE_BLOG_FAIL,
				payload: error,
			});
		}
	};

// TODO: check the type and adjust according to the expcted type
export const createBlogAction =
	(details: api.singleBlogType): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createBlog(details);
			const { data } = response;

			dispatch({
				type: types.CREATE_BLOG_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatch({
				type: types.CREATE_BLOG_FAIL,
				payload: error,
			});
		}
	};

export const createBlogCommentAction =
	(details: api.commentRequestType, blogId: string): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createBlogComment(details, blogId);
			const { data } = response;

			dispatch({
				type: types.CREATE_BLOG_COMMENT_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatch({
				type: types.CREATE_BLOG_COMMENT_FAIL,
				payload: error,
			});
		}
	};

export const getBlogCommentsAction =
	(details: paginateType, blogId: string): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getBlogComments(details, blogId);
			const data = response;

			dispatch({
				type: types.GET_BLOG_COMMENT_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_BLOG_COMMENT_FAIL,
				payload: error,
			});
		}
	};

export const deleteBlogCommentsAction =
	(blogId: string): BlogThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.deleteBlogComments(blogId);
			const data = response;

			dispatch({
				type: types.DELETE_BLOG_COMMENT_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.DELETE_BLOG_COMMENT_FAIL,
				payload: error,
			});
		}
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
