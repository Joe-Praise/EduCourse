import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

interface metaData {
	totalDocuments: number;
	pageNumber: number;
	totalPages: number;
	count: number;
}

export type paginateType = {
	limit: string;
	page: string;
};

interface courseDataType {
	_id: string;
	title: string;
	description: string;
	level: string;
	language: string;
	instructor: string;
	slug: string;
	__v: number;
	ratingsAverage: number;
	ratingsQuantity: number;
}

type OmittedCourseDataType = Omit<courseDataType, '__v'>;

export type courseType = {
	status: string;
	metaData: metaData;
	data: OmittedCourseDataType[];
};

interface Course {
	[key: string]: unknown;
}

interface ApiResponse {
	data: Course[];
	error: string;
}

export const getCourses = async <T>(
	page: T,
	limit: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/courses?page=${page}&${limit}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCourseBySlug = async <T>(slug: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(`/api/v1/courses?slug=${slug}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCourseModules = async <T>(
	courseId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/modules?courseId=${courseId}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCourseReviews = async <T>(
	courseId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/courses/${courseId}/reviews`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
