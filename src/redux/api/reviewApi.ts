import { handleApiError } from '../../util/helperFunctions/helper';
import { metaData } from '../sharedTypes';
import { paginateType } from './courseAPI';
import { axiosInstance as API } from './utils';

export interface reviewType {
	_id: string;
	userId: UserID;
	courseId: string;
	review: string;
	rating: number;
	createdAt: string;
}

export interface UserID {
	_id: string;
	name: string;
	email: string;
	photo: string;
	role: string[];
}

export type OmittedReviewDataType = Omit<reviewType, '__v'>;

export type reviewDatatype = {
	status: string;
	metaData: metaData;
	data: OmittedReviewDataType[];
};

interface Review {
	[key: string]: unknown;
}

interface ApiResponse {
	data: Review[];
	error: string;
}

export interface createReviewPayloadType {
	review: string;
	rating: string;
}

export const getCourseReviews = async <T>(
	details: paginateType,
	courseId: T
): Promise<ApiResponse> => {
	try {
		const { page, limit } = details;
		const { data } = await API.get<ApiResponse>(
			`/api/v1/courses/${courseId}/reviews?page=${page}&limit=${limit}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createCourseReview = async <T>(
	payload: createReviewPayloadType,
	courseId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.post<ApiResponse>(
			`/api/v1/courses/${courseId}/reviews`,
			payload
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteReview = async <T>(reviewId: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.delete(`/api/v1/reviews/${reviewId}/reviews`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
