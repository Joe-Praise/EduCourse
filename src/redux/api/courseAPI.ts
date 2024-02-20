import { handleApiError } from '../../util/helperFunctions/helper';
import { metaData } from '../sharedTypes';
import { axiosInstance as API } from './utils';

// SINGLECOURSETYPE STARTS HERE
export interface SingleCourseType {
	_id: string;
	title: string;
	description: string;
	imageCover: string;
	level: string;
	language: string;
	instructors: Instructor[];
	category: Category;
	duration: string;
	ratingsAverage: number;
	ratingsQuantity: number;
	ratingSummary: ratingSummaryType[];
	price: number;
	priceCategory: string;
	studentsQuantity: number;
	createdAt: Date;
	slug: string;
	__v: number;
	averageRatings: { [key: string]: number }[];
}

export interface ratingSummaryType {
	title: string;
	value: number;
}

export interface Category {
	_id: string;
	name: string;
	group: string;
}

export interface Instructor {
	links: Link[];
	_id: string;
	userId: UserID;
	description: string;
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
	photo: string;
	role: string[];
}
// SINGLECOURSETYPE ENDS HERE

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

export interface createLectureType {
	userId: string;
	courseId: string;
}

export const getCourses = async (
	details: paginateType
): Promise<ApiResponse> => {
	try {
		const { page, limit } = details;
		const { data } = await API.get<ApiResponse>(
			`/api/v1/courses?page=${page}&limit=${limit}`
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

export const getCouresById = async <T>(courseId: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(`/api/v1/courses/${courseId}`);
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

export const getLectureModules = async <T>(
	courseId: T
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/modules/lecture?courseId=${courseId}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createLectureCourse = async (
	details: createLectureType
): Promise<ApiResponse> => {
	try {
		const { data } = await API.post<ApiResponse>(
			`/api/v1/completed-courses`,
			details
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const checkIsActiveCourse = async (
	details: createLectureType
): Promise<ApiResponse> => {
	const { userId, courseId } = details;
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/completed-courses/active/course?courseId=${courseId}&userId=${userId}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

// export const checkIsActiveCourse = async (
// 	details: createLectureType
// ): Promise<ApiResponse> => {
// 	try {
// 		const { data } = await API.post<ApiResponse>(
// 			`/api/v1/completed-courses`,
// 			details
// 		);
// 		return data;
// 	} catch (error) {}
// };
// (
// 	`/api/v1/completed-courses/active/course?${}`,
// )
