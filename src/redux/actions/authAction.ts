import { NavigateFunction } from 'react-router-dom';
import {
	removeLocalStorage,
	saveLocalStorage,
} from '../../util/helperFunctions/helper';
import * as api from '../api/authApi';
import * as types from '../constants/authConstants';
import { ThunkAction } from 'redux-thunk';
import { AppDispatch, RootState } from '../store';
// import { user } from '../reducers/userSlice';
// import { courseState } from '../reducers/courseSlice';
// import { Action } from '@reduxjs/toolkit';

type SignUpSuccessAction = {
	type: typeof types.SIGNUP_SUCCESS;
	payload: any; // Adjust the payload type accordingly
};

type SignUpFailAction = {
	type: typeof types.SIGNUP_FAIL;
	payload: any; // Adjust the payload type accordingly
};

type SignInSuccessAction = {
	type: typeof types.SIGNIN_SUCCESS;
	payload: any; // Adjust the payload type accordingly
};

type SignInFailAction = {
	type: typeof types.SIGNIN_FAIL;
	payload: any; // Adjust the payload type accordingly
};

export type AuthActionTypes =
	| SignUpSuccessAction
	| SignUpFailAction
	| SignInSuccessAction
	| SignInFailAction;

// Correctly align the ThunkDispatch type
// type ThunkDispatchType = ThunkDispatch<
// 	{
// 		user:
// 			| { userObj: any; token: any; userError: string }
// 			| { userError: any; userObj: user; token: string };
// 		course: courseState;
// 	},
// 	undefined,
// 	AuthActionTypes
// >;

// Correctly align the AppDispatch type
export type AppDispatchType = AppDispatch;

// Correctly align the AppThunk type
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	AuthActionTypes
>;

export const signUpAction =
	(details: api.signUpType, navigate: NavigateFunction): AppThunk =>
	async (dispatch: AppDispatch) => {
		try {
			localStorage.removeItem('profile');
			const response = await api.signUp(details);
			const { error } = response;
			if (error) {
				dispatch({
					type: types.SIGNUP_FAIL,
					payload: error,
				});
			} else {
				dispatch({
					type: types.SIGNUP_SUCCESS,
					payload: types.SIGNUP_SUCCESS_MESSAGE,
				});
				navigate('/signin');
			}
		} catch (error) {
			dispatch({
				type: types.SIGNUP_FAIL,
				payload: types.ERROR_MESSAGE,
			});
		}
	};

export const signInAction =
	(details: api.signInType, navigate: NavigateFunction): AppThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.signIn(details);
			const { error, data } = response;
			if (error) {
				dispatch({
					type: types.SIGNIN_FAIL,
					payload: error,
				});
			} else {
				const { data: user, token, status } = data;
				const profile = {
					user: user?.user,
					token,
					status,
				};

				saveLocalStorage(profile, 'profile');
				dispatch({
					type: types.SIGNIN_SUCCESS,
					payload: profile,
				});
				navigate('/');
			}
		} catch (error) {
			await dispatch({
				type: types.SIGNIN_FAIL,
				payload: types.ERROR_MESSAGE,
			});
			navigate('/signin');
		}
	};

export const logoutAction = () => {
	try {
		//   const { data } = await api.logout();
		removeLocalStorage('profile');
		return { type: types.LOGOUT };
	} catch (error) {
		return { type: types.LOGOUT, payload: types.ERROR_MESSAGE };
	}
};

export const setInitialAuthState = (navigate: NavigateFunction) => {
	navigate('/signin');
	return { type: types.LOGOUT };
};
