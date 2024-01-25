import * as api from '../api/userApi';
import * as types from '../constants/userConstants';

export const getUserAction = () => async (dispatch: any) => {
	try {
		const { error, data } = await api.getUser();

		if (error) {
			throw new Error(error);
		}

		dispatch({
			type: types.GET_USER_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: types.GET_USER_FAIL,
			payload: error,
		});
	}
};

export const updateUser = (formData: FormData) => async (dispatch: any) => {
	try {
		const { error, data } = await api.updateUser(formData);
		if (error) {
			throw new Error(error);
		}

		dispatch({
			type: types.UPDATE_USER_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: types.UPDATE_USER_FAIL,
			payload: error,
		});
	}
};
