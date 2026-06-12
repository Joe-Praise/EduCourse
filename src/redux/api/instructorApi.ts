import { handleApiError } from '../../util/helperFunctions/helper';
import { ApiResponse, metaData, paginateType } from '../sharedTypes';
import { axiosInstance as API } from './utils';

export interface InstructorType {
	_id: string;
	// Optional: YouTube-imported instructors have no linked platform user.
	userId?: UserID;
	title: string;
	expertise: string;
	description: string;
	links: Link[];
	// 'user' (a real platform account) | 'youtube' (AI-imported channel)
	source?: 'user' | 'youtube';
	channelName?: string;
	channelThumbnailUrl?: string;
	channelUrl?: string;
	subscriberCount?: number;
}

export interface Link {
	_id: string;
	platform: string;
	url: string;
	displayName?: string;
}

export interface UserID {
	_id: string;
	name: string;
	email: string;
	role: string[];
	photo: string;
}

export type OmittedInstructorDataType = InstructorType;

export type instructorDataType = {
	status: string;
	metaData: metaData;
	data: OmittedInstructorDataType[];
};

// interface Instructor {
// 	[key: string]: unknown;
// }

// interface ApiResponse {
// 	data: Instructor[] | null;
// 	error: string;
// }

export interface createInstructorPayloadType {
	userId: string;
	links: string[];
}

export const getInstructors = async (
	details: paginateType
): Promise<ApiResponse> => {
	try {
		// NOTE: intentionally NOT session-cached. The backend now returns only
		// instructors with a published course, and that set changes as courses
		// are imported/published. A stale sessionStorage copy would resurrect
		// course-less instructors in the courses filter — so always fetch fresh.
		const { page, limit } = details;
		const { data } = await API.get<ApiResponse>(
			`/api/v1/instructors?page=${page}&limit=${limit}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getMyLearningInstructorApi = async <T>(
	userId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/instructors/myLearningInstructors/${userId}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getSingleInstructor = async <T>(
	instructorId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/instructors/${instructorId}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createInstructor = async (
	payload: createInstructorPayloadType
): Promise<ApiResponse> => {
	try {
		const { data } = await API.post<ApiResponse>(
			`/api/v1/instructors`,
			payload
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateInstructor = async (
	payload: createInstructorPayloadType
): Promise<ApiResponse> => {
	try {
		const { data } = await API.patch<ApiResponse>(
			`/api/v1/instructors`,
			payload
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteInstructor = async <T>(
	instructorId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.delete(`/api/v1/instructors/${instructorId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
