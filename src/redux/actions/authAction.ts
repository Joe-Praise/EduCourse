import { NavigateFunction } from 'react-router-dom';
import {
	getLocalStorage,
	removeLocalStorage,
	saveLocalStorage,
} from '../../util/helperFunctions/helper';
import * as api from '../api/authApi';
import * as types from '../constants/authConstants';
import { ThunkAction } from 'redux-thunk';
import { AppDispatch, RootState } from '../store';

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

type RefreshTokenFail = {
	type: typeof types.REFRESH_TOKEN_FAIL;
	payload: any;
};

export type AuthActionTypes =
	| SignUpSuccessAction
	| SignUpFailAction
	| SignInSuccessAction
	| SignInFailAction
	| RefreshTokenFail;

// Correctly align the AppDispatch type
export type AppDispatchType = AppDispatch;

// Correctly align the AppThunk type
export type AuthThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	undefined,
	AuthActionTypes
>;

export const signUpAction =
	(details: api.signUpType, navigate: NavigateFunction): AuthThunk =>
	async (dispatch: AppDispatch) => {
		try {
			localStorage.removeItem('profile');
			const response = await api.signUp(details);
			const { error } = response;
			if (error) {
				throw new Error(error);
			} else {
				dispatch({
					type: types.SIGNUP_SUCCESS,
					payload: types.SIGNUP_SUCCESS_MESSAGE,
				});
				navigate('/signin');
			}
		} catch (error: any) {
			dispatch({
				type: types.SIGNUP_FAIL,
				payload: error.message || types.ERROR_MESSAGE,
			});
		}
	};

export const signInAction =
	(details: api.signInType, navigate: NavigateFunction): AuthThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.signIn(details);
			const { error } = response;

			if (error) {
				// TODO: Have notification reducer to handle all notifications
				console.log('from signin error block', error);
				throw new Error(error);
			}

			const { data: user, token, status } = response;

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
		} catch (error: any) {
			await dispatch({
				type: types.SIGNIN_FAIL,
				payload: error.message || types.ERROR_MESSAGE,
			});
		}
	};

export const isLoggedIn =
	(navigate: NavigateFunction): AuthThunk =>
	async (dispatch: AppDispatch) => {
		try {
			const response = await api.checkToken();
			const { error } = response;
			if (error) {
				// done in order to hide the loading page as we have unprotected routes
				navigate('/signin');
				removeLocalStorage('profile');
				dispatch({
					type: types.REFRESH_TOKEN_FAIL,
					payload: error,
				});
			}
			const { data: user, token, status } = response;
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
		} catch (error: any) {
			dispatch({
				type: types.SIGNIN_FAIL,
				payload: error.message || types.ERROR_MESSAGE,
			});
		}
	};

export const logoutAction = (navigate: NavigateFunction) => {
	try {
		removeLocalStorage('profile');

		if (getLocalStorage('profile') === null) {
			navigate('/signin');
		} else {
			throw new Error('Somthing went wrong!');
		}
		return { type: types.LOGOUT };
	} catch (error: any) {
		console.log(error.message);
		return { type: types.LOGOUT, payload: types.ERROR_MESSAGE };
	}
};

export const setInitialAuthState = (navigate: NavigateFunction) => {
	navigate('/signin');
	return { type: types.LOGOUT };
};
