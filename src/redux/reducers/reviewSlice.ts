import { reviewType } from '../api/reviewApi';
import * as types from '../constants/reviewConstants';

export type reviewState = {
	review: reviewType[];
	reviewError: string;
};

const initialState: reviewState = {
	review: [],
	reviewError: '',
};

const reviewSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.GET_COURSE_REVIEW_SUCCESS:
		case types.UPDATE_REVIEWS_SUCCESS:
			return {
				...state,
				review: payload,
			};
		case types.GET_COURSE_REVIEW_FAIL:
		case types.UPDATE_REVIEWS_FAIL:
		case types.DELETE_REVIEW_FAIL:
			return {
				...state,
				reviewError: payload,
			};
		case types.DELETE_REVIEW_SUCCESS:
			return {
				...state,
				review: state.review.filter((post) => post._id !== payload),
			};
		case types.CREATE_COURSE_REVIEW_SUCCESS:
			return {
				...state,
				review: [payload.data, ...state.review],
			};
		case types.CREATE_COURSE_REVIEW_FAIL:
			return {
				...state,
				reviewError: payload,
			};
		default:
			return state;
	}
};

export default reviewSlice;
