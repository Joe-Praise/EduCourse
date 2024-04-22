import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export type user = {
	_id: string;
	name: string;
	email: string;
	photo: string;
	role: string;
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
		const { data } = await API.patch(`/updateMe`, formData, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return { error: null, data };
	} catch (error) {
		return handleApiError(error);
	}
};
