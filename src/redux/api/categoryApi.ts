import { handleApiError } from '../../util/helperFunctions/helper';
import { metaData } from '../sharedTypes';
import { paginateType } from './courseAPI';
import { axiosInstance as API } from './utils';

export interface categoryType {
	_id: string;
	name: string;
	group: string;
	__v: number;
}

export type OmittedCategoryDataType = Omit<categoryType, '__v'>;

export type categoryDatatype = {
	status: string;
	metaData: metaData;
	data: OmittedCategoryDataType[];
};

interface Review {
	[key: string]: unknown;
}

interface ApiResponse {
	data: Review[];
	error: string;
}

export interface createCategoryPayloadType {
	name: string;
	group: 'course' | 'blog';
}

export const getCategories = async (
	details: paginateType
): Promise<ApiResponse> => {
	try {
		const { page, limit } = details;
		const { data } = await API.get<ApiResponse>(
			`/api/v1/category?page=${page}&limit=${limit}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getSingleCategory = async <T>(
	categoryId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/category/${categoryId}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createCategory = async (
	payload: createCategoryPayloadType
): Promise<ApiResponse> => {
	try {
		const { data } = await API.post<ApiResponse>(`/api/v1/courses`, payload);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateCategory = async (
	payload: createCategoryPayloadType
): Promise<ApiResponse> => {
	try {
		const { data } = await API.patch<ApiResponse>(`/api/v1/courses`, payload);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteCategory = async <T>(
	categoryId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.delete(`/api/v1/reviews/${categoryId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
