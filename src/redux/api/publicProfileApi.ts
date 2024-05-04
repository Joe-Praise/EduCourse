import {
	getSessionStorage,
	handleApiError,
	saveSessionStorage,
} from '../../util/helperFunctions/helper';
import { ApiResponse } from '../sharedTypes';
import { axiosInstance as API } from './utils';
import * as types from '../constants/publicProfile';
import { publicProfileType } from '../actions/publicProfileAction';

export const getPublicProfileApi = async (
	// details: paginateType,
	userId: string
	// queryString: Partial<string>
): Promise<ApiResponse> => {
	try {
		const cachedProfile = getSessionStorage(types.PUBLIC_PROFILE_CONST);
		if (cachedProfile && checkForUser(cachedProfile, userId)) {
			return cachedProfile;
		}

		const url = `/api/v1/users/${userId}/profile`;
		const { data } = await API.get<ApiResponse>(url);

		saveSessionStorage(types.PUBLIC_PROFILE_CONST, data);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

function checkForUser(cachedData: publicProfileType, userId: string) {
	const isSameUser =
		cachedData.user._id === userId && cachedData.user._id === userId;
	return isSameUser;
}
