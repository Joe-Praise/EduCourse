import { handleApiError } from '../../util/helperFunctions/helper';
import { ApiResponse } from '../sharedTypes';
import { axiosInstance as API } from './utils';

export const getPublicProfileApi = async (
	// details: paginateType,
	userId: string
	// queryString: Partial<string>
): Promise<ApiResponse> => {
	try {
		const url = `/api/v1/users/${userId}/profile`;
		const { data } = await API.get<ApiResponse>(url);

		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
