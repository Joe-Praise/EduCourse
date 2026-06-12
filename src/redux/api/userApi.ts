import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export type user = {
	_id: string;
	name: string;
	email: string;
	photo: string;
	role: string[];
};

export const getUser = async () => {
	try {
		const { data } = await API.get(`/api/v1/users/me`);
		return { error: null, data };
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateUser = async (formData: FormData) => {
	try {
		const { data } = await API.patch(`/api/v1/users/updateMe`, formData);
		return { error: null, data };
	} catch (error) {
		return handleApiError(error);
	}
};

export const updatePassword = async (payload: {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}) => {
	try {
		const { data } = await API.patch(`/api/v1/users/updateMyPassword`, payload);
		return { error: null, data };
	} catch (error) {
		return handleApiError(error);
	}
};

export interface StreakDay {
	date: string;
	count: number;
}

export interface StreakData {
	days: StreakDay[];
	currentStreak: number;
	longestStreak: number;
}

export interface BadgeData {
	id: string;
	name: string;
	description: string;
	earned: boolean;
}

export const getLearningStreakApi = async () => {
	try {
		const { data } = await API.get('/api/v1/users/streak');
		return data as { data: StreakData; status: string };
	} catch (error) {
		return handleApiError(error);
	}
};

export const getUserBadgesApi = async () => {
	try {
		const { data } = await API.get('/api/v1/users/badges');
		return data as { data: BadgeData[]; status: string };
	} catch (error) {
		return handleApiError(error);
	}
};
