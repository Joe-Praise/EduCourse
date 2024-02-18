import * as types from '../constants/categoryConstants';
import { OmittedCategoryDataType } from '../api/categoryApi';

export type categoryState = {
	categories: OmittedCategoryDataType[];
	singleCategory: OmittedCategoryDataType;
	categoryError: string;
};

const initialState: categoryState = {
	categories: [],
	singleCategory: {
		_id: '',
		name: '',
		group: '',
	},
	categoryError: '',
};

const categorySlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.GET_CATEGORY_SUCCESS:
			return {
				...state,
				categories: payload,
			};
		case types.UPDATE_CATEGORY_SUCCESS:
			return {
				...state,
				categories: state.categories.map((category) =>
					category._id === payload._id ? payload : category
				),
				singleCategory: payload || state.singleCategory,
			};
		case types.GET_CATEGORY_FAIL:
		case types.UPDATE_CATEGORY_FAIL:
		case types.DELETE_CATEGORY_FAIL:
			return {
				...state,
				categoryError: payload,
			};
		case types.DELETE_CATEGORY_SUCCESS:
			return {
				...state,
				categories: state.categories.filter((post) => post._id !== payload),
			};
		case types.CREATE_CATEGORY_SUCCESS:
			return {
				...state,
				categories: [payload.data, ...state.categories],
			};
		case types.CREATE_CATEGORY_FAIL:
			return {
				...state,
				categoryError: payload,
			};
		default:
			return state;
	}
};

export default categorySlice;
