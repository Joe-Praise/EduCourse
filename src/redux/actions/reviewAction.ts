import { ThunkAction } from 'redux-thunk';
import * as api from '../api/reviewApi';
import * as types from '../constants/reviewConstants';
import { AppDispatch, RootState } from '../store';
import { paginateType } from '../sharedTypes';
import {
	dispatchErrorHandler,
	dispatchSuccessHandler,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';

type GetCourseReviewSuccessAction = {
	type: typeof types.GET_COURSE_REVIEW_SUCCESS;
	payload: any;
};

type GetCourseReviewFailAction = {
	type: typeof types.GET_COURSE_REVIEW_FAIL;
	payload: any;
};

type CreateCourseReviewSuccessAction = {
	type: typeof types.CREATE_COURSE_REVIEW_SUCCESS;
	payload: any;
};

type CreateCourseReviewFailAction = {
	type: typeof types.CREATE_COURSE_REVIEW_FAIL;
	payload: any;
};

type UpdateReviewSuccessAction = {
	type: typeof types.UPDATE_REVIEWS_SUCCESS;
	payload: any;
};

type UpdateReviewFailAction = {
	type: typeof types.UPDATE_REVIEWS_FAIL;
	payload: any;
};

type DeleteReviewSuccessAction = {
	type: typeof types.DELETE_REVIEW_SUCCESS;
	payload: any;
};

type DeleteReviewFailAction = {
	type: typeof types.DELETE_REVIEW_FAIL;
	payload: any;
};

export type ReviewActionTypes =
	| GetCourseReviewSuccessAction
	| GetCourseReviewFailAction
	| UpdateReviewSuccessAction
	| UpdateReviewFailAction
	| DeleteReviewSuccessAction
	| DeleteReviewFailAction
	| CreateCourseReviewSuccessAction
	| CreateCourseReviewFailAction;

export type ReviewThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	ReviewActionTypes
>;

export const getCoursesReviewAction =
	(details: paginateType, courseId: string): ReviewThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getCourseReviews(details, courseId);
			const { error, data } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_COURSE_REVIEW_SUCCESS,
				payload: data,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);

			// dispatch({
			// 	type: types.GET_COURSE_REVIEW_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const createCourseReviewAction =
	(payload: api.createReviewPayloadType, courseId: string): ReviewThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createCourseReview(payload, courseId);
			const { error, data } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.CREATE_COURSE_REVIEW_SUCCESS,
				payload: data,
			});

			dispatchSuccessHandler(dispatch, 'Thank you for your feedback!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);

			// dispatch({
			// 	type: types.CREATE_COURSE_REVIEW_FAIL,
			// 	payload: error.message,
			// });
		}
	};

export const deleteReviewAction =
	(reviewId: string): ReviewThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.deleteReview(reviewId);
			const { error, data } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.DELETE_REVIEW_SUCCESS,
				payload: data,
			});

			dispatchSuccessHandler(dispatch, 'Delete Successful!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.DELETE_REVIEW_FAIL,
			// 	payload: error.message,
			// });
		}
	};
