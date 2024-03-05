import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export type signInType = {
	email: string;
	password: string;
};

export const signIn = async (details: signInType) => {
	try {
		const { data } = await API.post('api/v1/users/login', details);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export type signUpType = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export const signUp = async (details: signUpType) => {
	try {
		const { data } = await API.post('api/v1/users/signup', details);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const checkToken = async () => {
	try {
		const { data } = await API.get('api/v1/users/checkToken');
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
