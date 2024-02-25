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

export type BlogActionTypes = GetBlogsSuccessAction | GetBlogsFailAction;

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

export const createBlogAction =
	(
		details: api.singleBlogType
		// navigate: NavigateFunction,
		// params: paramsType.
	): BlogThunk =>
	async (dispatch: AppDispatch) => {
		// const { slug, id } = params;
		try {
			const response = await api.createBlog(details);
			const { data } = response;

			dispatch({
				type: types.CREATE_BLOG_SUCCESS,
				payload: data,
			});

			// routes to the learn course page
			// navigate(`/courses/${slug}/lecture/${id}`);
		} catch (error: any) {
			dispatch({
				type: types.CREATE_BLOG_FAIL,
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
