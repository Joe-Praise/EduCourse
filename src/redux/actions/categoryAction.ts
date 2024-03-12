import { ThunkAction } from 'redux-thunk';
import * as api from '../api/categoryApi';
import * as types from '../constants/categoryConstants';
import { AppDispatch, RootState } from '../store';
import { paginateType } from '../sharedTypes';
import {
	dispatchErrorHandler,
	dispatchSuccessHandler,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';

type CreateCategorySuccessAction = {
	type: typeof types.CREATE_CATEGORY_SUCCESS;
	payload: any;
};

type CreateCategoryFailAction = {
	type: typeof types.CREATE_CATEGORY_FAIL;
	payload: any;
};

type GetCategorySuccessAction = {
	type: typeof types.GET_CATEGORY_SUCCESS;
	payload: any;
};

type GetCategoryFailAction = {
	type: typeof types.GET_CATEGORY_FAIL;
	payload: any;
};

type GetSingleCategorySuccessAction = {
	type: typeof types.GET_SINGLE_CATEGORY_SUCCESS;
	payload: any;
};

type GetSingleCategoryFailAction = {
	type: typeof types.GET_SINGLE_CATEGORY_FAIL;
	payload: any;
};

type UpdateCategorySuccessAction = {
	type: typeof types.UPDATE_CATEGORY_SUCCESS;
	payload: any;
};

type UpdateCategoryFailAction = {
	type: typeof types.UPDATE_CATEGORY_FAIL;
	payload: any;
};

type DeleteCategorySuccessAction = {
	type: typeof types.DELETE_CATEGORY_SUCCESS;
	payload: any;
};

type DeleteCategoryFailAction = {
	type: typeof types.DELETE_CATEGORY_FAIL;
	payload: any;
};

export type CategoryActionTypes =
	| CreateCategorySuccessAction
	| CreateCategoryFailAction
	| GetCategorySuccessAction
	| GetCategoryFailAction
	| GetSingleCategorySuccessAction
	| GetSingleCategoryFailAction
	| UpdateCategorySuccessAction
	| UpdateCategoryFailAction
	| DeleteCategorySuccessAction
	| DeleteCategoryFailAction;

export type CategoryThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	CategoryActionTypes
>;

export const createCategotyAction =
	(payload: api.createCategoryPayloadType): CategoryThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createCategory(payload);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.CREATE_CATEGORY_SUCCESS,
				payload: response,
			});

			dispatchSuccessHandler(dispatch, 'Successfully Created!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.CREATE_CATEGORY_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const getCategoryAction =
	(details: paginateType, group: string): CategoryThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getCategories(details, group);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_CATEGORY_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_CATEGORY_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const getSingleCategoryAction =
	(categoryId: string): CategoryThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getSingleCategory(categoryId);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_SINGLE_CATEGORY_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_SINGLE_CATEGORY_FAIL,
			// 	payload: error,
			// });
		}
	};

export const updateCategory =
	(payload: api.createCategoryPayloadType): CategoryThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getSingleCategory(payload);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_SINGLE_CATEGORY_SUCCESS,
				payload: response,
			});
			dispatchSuccessHandler(dispatch, 'Update Successful!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_SINGLE_CATEGORY_FAIL,
			// 	payload: error,
			// });
		}
	};

export const deleteCategoryAction =
	(categoryId: string): CategoryThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.deleteCategory(categoryId);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.DELETE_CATEGORY_SUCCESS,
				payload: response,
			});

			dispatchSuccessHandler(dispatch, 'Successfully Deleted!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.DELETE_CATEGORY_SUCCESS,
			// 	payload: error,
			// });
		}
	};
