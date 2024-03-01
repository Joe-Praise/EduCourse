import { ThunkAction } from 'redux-thunk';
import * as api from '../api/reviewApi';
import * as types from '../constants/reviewConstants';
import { AppDispatch, RootState } from '../store';
import { paginateType } from '../sharedTypes';

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
			const data = response;
			console.log('coming from reviewAction api call', data, courseId);
			dispatch({
				type: types.GET_COURSE_REVIEW_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.GET_COURSE_REVIEW_FAIL,
				payload: error,
			});
		}
	};

export const createCourseReviewAction =
	(payload: api.createReviewPayloadType, courseId: string): ReviewThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createCourseReview(payload, courseId);
			const data = response;

			console.log(data);
			dispatch({
				type: types.CREATE_COURSE_REVIEW_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.CREATE_COURSE_REVIEW_FAIL,
				payload: error,
			});
		}
	};

export const deleteReviewAction =
	(reviewId: string): ReviewThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.deleteReview(reviewId);
			const data = response;

			dispatch({
				type: types.DELETE_REVIEW_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: types.DELETE_REVIEW_FAIL,
				payload: error,
			});
		}
	};
