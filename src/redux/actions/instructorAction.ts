import { ThunkAction } from 'redux-thunk';
import * as api from '../api/instructorApi';
import * as types from '../constants/instructorConstants';
import { AppDispatch, RootState } from '../store';
import { paginateType } from '../sharedTypes';
import {
	dispatchErrorHandler,
	dispatchSuccessHandler,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';

type CreateInstructorSuccessAction = {
	type: typeof types.CREATE_INSTRUCTOR_SUCCESS;
	payload: any;
};

type CreateInstructorFailAction = {
	type: typeof types.CREATE_INSTRUCTOR_FAIL;
	payload: any;
};

type GetInstructorsSuccessAction = {
	type: typeof types.GET_INSTRUCTORS_SUCCESS;
	payload: any;
};

type GetInstructorsFailAction = {
	type: typeof types.GET_INSTRUCTORS_FAIL;
	payload: any;
};

type GetMyLearningInstructorSuccessAction = {
	type: typeof types.GET_MY_LEARNING_INSTRUCTORS_SUCCESS;
	payload: any;
};

type GetMyLearningInstructorFailAction = {
	type: typeof types.GET_MY_LEARNING_INSTRUCTORS_FAIL;
	payload: any;
};

type GetSingleInstructorSuccessAction = {
	type: typeof types.GET_SINGLE_INSTRUCTOR_SUCCESS;
	payload: any;
};

type GetSingleInstructorFailAction = {
	type: typeof types.GET_SINGLE_INSTRUCTOR_FAIL;
	payload: any;
};

type UpdateInstructorSuccessAction = {
	type: typeof types.UPDATE_INSTRUCTOR_SUCCESS;
	payload: any;
};

type UpdateInstructorFailAction = {
	type: typeof types.UPDATE_INSTRUCTOR_FAIL;
	payload: any;
};

type DeleteInstructorSuccessAction = {
	type: typeof types.DELETE_INSTRUCTOR_SUCCESS;
	payload: any;
};

type DeleteInstructorFailAction = {
	type: typeof types.DELETE_INSTRUCTOR_FAIL;
	payload: any;
};

export type InstructorActionTypes =
	| CreateInstructorSuccessAction
	| CreateInstructorFailAction
	| GetInstructorsSuccessAction
	| GetInstructorsFailAction
	| GetMyLearningInstructorSuccessAction
	| GetMyLearningInstructorFailAction
	| GetSingleInstructorSuccessAction
	| GetSingleInstructorFailAction
	| UpdateInstructorSuccessAction
	| UpdateInstructorFailAction
	| DeleteInstructorSuccessAction
	| DeleteInstructorFailAction;

export type InstructorThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	InstructorActionTypes
>;

export const createInstructorAction =
	(payload: api.createInstructorPayloadType): InstructorThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.createInstructor(payload);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.CREATE_INSTRUCTOR_SUCCESS,
				payload: response,
			});

			dispatchSuccessHandler(dispatch, 'Instructor Successfully Created!');
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.CREATE_INSTRUCTOR_FAIL,
			// 	payload: error,
			// });
		}
	};

export const getInstructorAction =
	(details: paginateType): InstructorThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getInstructors(details);
			const { error } = response;

			throwErrorHandler(error);
			dispatch({
				type: types.GET_INSTRUCTORS_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_INSTRUCTORS_FAIL,
			// 	payload: error,
			// });
		}
	};

export const GetMyLearningInstructorAction =
	(userId: string): InstructorThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getMyLearningInstructorApi(userId);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_MY_LEARNING_INSTRUCTORS_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_MY_LEARNING_INSTRUCTORS_FAIL,
			// 	payload: error,
			// });
		}
	};

export const getSingleInstructorAction =
	(instructorId: string): InstructorThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getSingleInstructor(instructorId);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_SINGLE_INSTRUCTOR_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_SINGLE_INSTRUCTOR_FAIL,
			// 	payload: error,
			// });
		}
	};

export const updateInstructorAction =
	(payload: api.createInstructorPayloadType): InstructorThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.getSingleInstructor(payload);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.GET_SINGLE_INSTRUCTOR_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.GET_SINGLE_INSTRUCTOR_FAIL,
			// 	payload: error,
			// });
		}
	};

export const deleteInstructorAction =
	(instructorId: string): InstructorThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.deleteInstructor(instructorId);
			const { error } = response;

			throwErrorHandler(error);

			dispatch({
				type: types.DELETE_INSTRUCTOR_SUCCESS,
				payload: response,
			});
		} catch (error: any) {
			dispatchErrorHandler(dispatch, error.message);
			// dispatch({
			// 	type: types.DELETE_INSTRUCTOR_SUCCESS,
			// 	payload: error,
			// });
		}
	};
