import { LOGOUT } from '../constants/authConstants';
import * as types from '../constants/userConstants';

export type user = {
	_id: string;
	name: string;
	email: string;
	photo: string;
	role: string;
};

type userState = {
	userObj: user;
	token: string;
	userError: string;
};

const initialState: userState = {
	userObj: {
		_id: '',
		name: '',
		email: '',
		photo: '',
		role: '',
	},
	token: '',
	userError: '',
};

const userSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case LOGOUT:
			return {
				...state,
				userObj: {},
				token: '',
			};
		case types.GET_USER_SUCCESS:
			return {
				...state,
				userObj: payload.user,
				token: payload.token,
			};
		case types.GET_USER_FAIL:
			return {
				...state,
				userError: payload,
			};
		// case types.GET_USER_FAIL:
		// 	return {
		// 		...state,
		// 		userError: payload,
		// 	};
		default:
			return state;
	}
	// setUser: (state, action) => {
	// 	// state.token =
};

export default userSlice;
