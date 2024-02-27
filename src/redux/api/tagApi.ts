import { handleApiError } from '../../util/helperFunctions/helper';
import { metaData, paginateType } from '../sharedTypes';
import { axiosInstance as API } from './utils';

export interface tagType {
	_id: string;
	name: string;
}

export type categoryDatatype = {
	status: string;
	metaData: metaData;
	data: tagType[];
};

interface Review {
	[key: string]: unknown;
}

interface ApiResponse {
	data: Review[];
	error: string;
}

export interface createTagPayloadType {
	name: string;
}

export const getTags = async (details: paginateType): Promise<ApiResponse> => {
	try {
		const { page, limit } = details;
		const { data } = await API.get<ApiResponse>(
			`/api/v1/tags?page=${page}&limit=${limit}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getSingleTag = async <T>(tagId: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(`/api/v1/tags/${tagId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createTag = async (
	payload: createTagPayloadType
): Promise<ApiResponse> => {
	try {
		const { data } = await API.post<ApiResponse>(`/api/v1/tags`, payload);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateTag = async (
	payload: createTagPayloadType
): Promise<ApiResponse> => {
	try {
		const { data } = await API.patch<ApiResponse>(`/api/v1/tags`, payload);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteTag = async <T>(tagId: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.delete(`/api/v1/tags/${tagId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
