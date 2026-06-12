import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export type signInType = {
	email: string;
	password: string;
};

export const signIn = async (details: signInType) => {
	try {
		const { data } = await API.post('/api/v1/users/login', details);
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
		const { data } = await API.post('/api/v1/users/signup', details);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const checkToken = async () => {
	try {
		const { data } = await API.get('/api/v1/users/checkToken');
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

/**
 * Revokes the current refresh token on the server and clears the auth cookies.
 * Fire-and-forget — the client-side logout proceeds even if this fails.
 */
export const logoutApi = async () => {
	try {
		const { data } = await API.post('/api/v1/users/logout');
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const forgotPassword = async (email: string) => {
	try {
		const { data } = await API.post('/api/v1/users/forgotPassword', { email });
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export type resetPasswordPayload = {
	password: string;
	confirmPassword: string;
};

export const resetPassword = async (token: string, payload: resetPasswordPayload) => {
	try {
		const { data } = await API.patch(`/api/v1/users/resetPassword/${token}`, payload);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
