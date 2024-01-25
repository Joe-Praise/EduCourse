import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export type signInType = {
	email: string;
	password: string;
};

export const signIn = async (details: signInType) => {
	try {
		const { data } = await API.post('api/v1/users/login', details);
		return { error: null, data };
	} catch (error) {
		return handleApiError(error);
	}
};

export type signUpType = {
	name: string;
	matricNumber: string;
	email: string;
	password: string;
	passwordConfirm: string;
};

export const signUp = async (details: signUpType) => {
	try {
		const { data } = await API.post('api/v1/users/login', details);
		return { error: null, data };
	} catch (error) {
		return handleApiError(error);
	}
};
