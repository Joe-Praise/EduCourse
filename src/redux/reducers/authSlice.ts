import { getLocalStorage } from '../../util/helperFunctions/helper';
import * as types from '../constants/authConstants';
import { user } from './userSlice';

const authToken = getLocalStorage('profile')?.token;

type authState = {
	userData: user;
	refreshToken: string;
	token: string;
	signInError: string;
	signUpError: string[];
	successMessage: string;
	isLoading: boolean;
};

const initialState: authState = {
	userData: {
		_id: '',
		name: '',
		email: '',
		photo: '',
		role: '',
	},
	refreshToken: '',
	token: authToken || null,
	signInError: '',
	successMessage: '',
	signUpError: [],
	isLoading: true,
};

const authReducer = (state = initialState, action: any) => {
	const { type, payload } = action;

	switch (type) {
		case types.SET_ACCESS_TOKEN:
			return {
				...state,
				token: payload ? payload : null,
			};
		case types.SET_REFRESH_TOKEN:
			return {
				...state,
				refreshToken: payload ? payload : null,
			};
		case types.SET_USER_DATA:
			return {
				...state,
				userData: payload ? payload : null,
			};
		case types.SIGNUP_SUCCESS:
			return {
				...state,
				signInError: null,
				signUpError: [],
				successMessage: payload ? payload?.status : null,
			};

		case types.SIGNUP_FAIL:
			return {
				...state,
				successMessage: null,
				signInError: null,
				signUpError: payload ? payload : [],
				isLoading: false,
			};

		case types.SIGNIN_SUCCESS:
			return {
				...state,
				userData: payload ? payload.user : null,
				token: payload ? payload.token : null,
				refreshToken: payload ? payload.refreshToken : null,
				signInError: null,
				successMessage: payload ? payload?.status : null,
				isLoading: false,
			};

		case types.SIGNIN_FAIL:
			return {
				...state,
				successMessage: null,
				signUpError: [],
				signInError: payload ? payload : null,
			};
		case types.LOGOUT:
			return {
				...state,
				userData: null,
				refreshToken: null,
				token: null,
				signInError: null,
				signUpError: [],
				successMessage: null,
				isLoading: false,
			};

		case types.REFRESH_TOKEN_SUCCESS:
			return {
				...state,
				token: payload ? payload.token : null,
				refreshToken: payload ? payload.refreshToken : null,
			};

		case types.REFRESH_TOKEN_FAIL:
			return {
				...state,
				userData: null,
				refreshToken: null,
				token: null,
				signUpError: [],
				signInError: null,
				successMessage: null,
				isLoading: false,
			};
		case types.CLEAR_MESSAGE:
			return {
				...state,
				successMessage: null,
				signInError: null,
				signUpError: [],
			};

		default:
			return state;
	}
};

export default authReducer;
