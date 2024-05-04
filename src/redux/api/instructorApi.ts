import {
	getSessionStorage,
	handleApiError,
	saveSessionStorage,
} from '../../util/helperFunctions/helper';
import { ApiResponse, metaData, paginateType } from '../sharedTypes';
import { axiosInstance as API } from './utils';
import * as types from '../constants/instructorConstants';

export interface InstructorType {
	_id: string;
	userId: UserID;
	expertise: string;
	__v: number;
	description: string;
	links: Link[];
	id: string;
}

export interface Link {
	_id: string;
	platform: string;
	url: string;
}

export interface UserID {
	_id: string;
	name: string;
	email: string;
	role: string[];
	photo: string;
}

export type OmittedInstructorDataType = Omit<InstructorType, '__v'>;

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
		const cachedCourses = getSessionStorage(types.INSTRUCTOR_CONST);
		if (cachedCourses) {
			return cachedCourses;
		}

		const { page, limit } = details;
		const { data } = await API.get<ApiResponse>(
			`/api/v1/instructors?page=${page}&limit=${limit}`
		);

		saveSessionStorage(types.INSTRUCTOR_CONST, data);
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
		const { data } = await API.delete(`/api/v1/reviews/${instructorId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
