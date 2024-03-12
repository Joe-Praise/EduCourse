import {
	dispatchErrorHandler,
	throwErrorHandler,
} from '../../util/helperFunctions/helper';
import * as api from '../api/userApi';
import * as types from '../constants/userConstants';

export const getUserAction = () => async (dispatch: any) => {
	try {
		const { error, data } = await api.getUser();

		throwErrorHandler(error);

		dispatch({
			type: types.GET_USER_SUCCESS,
			payload: data,
		});
	} catch (error: any) {
		dispatchErrorHandler(dispatch, error.message);
		// dispatch({
		// 	type: types.GET_USER_FAIL,
		// 	payload: error,
		// });
	}
};

export const updateUser = (formData: FormData) => async (dispatch: any) => {
	try {
		const { error, data } = await api.updateUser(formData);
		throwErrorHandler(error);

		dispatch({
			type: types.UPDATE_USER_SUCCESS,
			payload: data,
		});
	} catch (error: any) {
		dispatchErrorHandler(dispatch, error.message);
		// dispatch({
		// 	type: types.UPDATE_USER_FAIL,
		// 	payload: error,
		// });
	}
};
