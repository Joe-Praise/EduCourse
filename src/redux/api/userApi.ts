import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';
handleApiError;

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
