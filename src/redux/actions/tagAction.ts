import { ThunkAction } from 'redux-thunk';
import * as api from '../api/tagApi';
import * as types from '../constants/tagConstants';
import { AppDispatch, RootState } from '../store';
import { paginateType } from '../sharedTypes';

type CreateTagSuccessAction = {
	type: typeof types.CREATE_TAG_SUCCESS;
	payload: any;
};

type CreateTagFailAction = {
	type: typeof types.CREATE_TAG_FAIL;
	payload: any;
};

type GetTagSuccessAction = {
	type: typeof types.GET_TAG_SUCCESS;
	payload: any;
};

type GetTagFailAction = {
	type: typeof types.GET_TAG_FAIL;
	payload: any;
};

type GetSingleTagSuccessAction = {
	type: typeof types.GET_SINGLE_TAG_SUCCESS;
	payload: any;
};

type GetSingleTagFailAction = {
	type: typeof types.GET_SINGLE_TAG_FAIL;
	payload: any;
};

type UpdateTagSuccessAction = {
	type: typeof types.UPDATE_TAG_SUCCESS;
	payload: any;
};

type UpdateTagFailAction = {
	type: typeof types.UPDATE_TAG_FAIL;
	payload: any;
};

type DeleteTagSuccessAction = {
	type: typeof types.DELETE_TAG_SUCCESS;
	payload: any;
};

type DeleteTagFailAction = {
	type: typeof types.DELETE_TAG_FAIL;
	payload: any;
};

export type TagActionTypes =
	| CreateTagSuccessAction
	| CreateTagFailAction
	| GetTagSuccessAction
	| GetTagFailAction
	| GetSingleTagSuccessAction
	| GetSingleTagFailAction
	| UpdateTagSuccessAction
	| UpdateTagFailAction
	| DeleteTagSuccessAction
	| DeleteTagFailAction;

export type TagThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	TagActionTypes
>;

export const createTagAction =
	(payload: api.createTagPayloadType): TagThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createTag(payload);
			const data = response;

			dispatch({
				type: types.CREATE_TAG_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.CREATE_TAG_FAIL,
				payload: error,
			});
		}
	};

export const getTagAction =
	(details: paginateType): TagThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getTags(details);
			const data = response;
			dispatch({
				type: types.GET_TAG_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_TAG_FAIL,
				payload: error,
			});
		}
	};

export const getSingleTagAction =
	(categoryId: string): TagThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getSingleTag(categoryId);
			const data = response;

			dispatch({
				type: types.GET_SINGLE_TAG_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_SINGLE_TAG_FAIL,
				payload: error,
			});
		}
	};

export const updateTag =
	(payload: api.createTagPayloadType): TagThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getSingleTag(payload);
			const data = response;

			dispatch({
				type: types.GET_SINGLE_TAG_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_SINGLE_TAG_FAIL,
				payload: error,
			});
		}
	};

export const deleteTagAction =
	(categoryId: string): TagThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.deleteTag(categoryId);
			const data = response;

			dispatch({
				type: types.DELETE_TAG_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.DELETE_TAG_SUCCESS,
				payload: error,
			});
		}
	};
