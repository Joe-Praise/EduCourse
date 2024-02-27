import * as types from '../constants/tagConstants';
import { tagType } from '../api/tagApi';

export type categoryState = {
	tags: tagType[];
	singleTag: tagType;
	tagError: string;
};

const initialState: categoryState = {
	tags: [],
	singleTag: {
		_id: '',
		name: '',
	},
	tagError: '',
};

const categorySlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.GET_TAG_SUCCESS:
			return {
				...state,
				tags: payload,
			};
		case types.UPDATE_TAG_SUCCESS:
			return {
				...state,
				tags: state.tags.map((category) =>
					category._id === payload._id ? payload : category
				),
				singleTag: payload || state.singleTag,
			};
		case types.GET_TAG_FAIL:
		case types.UPDATE_TAG_FAIL:
		case types.DELETE_TAG_FAIL:
			return {
				...state,
				tagError: payload,
			};
		case types.DELETE_TAG_SUCCESS:
			return {
				...state,
				tags: state.tags.filter((post) => post._id !== payload),
			};
		case types.CREATE_TAG_SUCCESS:
			return {
				...state,
				tags: [payload.data, ...state.tags],
			};
		case types.CREATE_TAG_FAIL:
			return {
				...state,
				tagError: payload,
			};
		default:
			return state;
	}
};

export default categorySlice;
