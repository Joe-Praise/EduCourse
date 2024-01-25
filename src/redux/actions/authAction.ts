import { NavigateFunction } from 'react-router-dom';
import {
	removeLocalStorage,
	saveLocalStorage,
} from '../../util/helperFunctions/helper';
import * as api from '../api/authApi';
import * as types from '../constants/authConstants';

export const signUpAction =
	(details: api.signUpType, navigate: NavigateFunction) =>
	async (dispatch: any) => {
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
				// if (!isConsentGiven) {
				dispatch({
					type: types.SIGNUP_SUCCESS,
					payload: types.SIGNUP_SUCCESS_MESSAGE,
				});
				navigate('/signin');
				// }

				// if (isConsentGiven) {
				// 	dispatch({
				// 		type: types.SIGNUP_SUCCESS,
				// 		payload: types.SIGNUP_SUCCESS_MESSAGE,
				// 	});
				// 	navigate('/auth/verify', { state: email });
				// }
			}
		} catch (error) {
			dispatch({
				type: types.SIGNUP_FAIL,
				payload: types.ERROR_MESSAGE,
			});
		}
	};

export const signInAction =
	(details: api.signInType, navigate: NavigateFunction) =>
	async (dispatch: any) => {
		try {
			const response = await api.signIn(details);
			const { error, data } = response;
			if (error) {
				dispatch({
					type: types.SIGNIN_FAIL,
					payload: error,
				});
			} else {
				// const { user, accessToken, refreshToken, accessTokenUpdatedAt } = data;
				// const profile = {
				// 	user,
				// 	accessToken,
				// 	refreshToken,
				// 	accessTokenUpdatedAt,
				// };
				const { data: user, token, status } = data;
				const profile = {
					user,
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
	// try {
	navigate('/signin');
	return { type: types.LOGOUT };
	// } catch (error) {
	// 	return { type: types.LOGOUT };
	// }
};
