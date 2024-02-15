import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

// SINGLECOURSETYPE STARTS HERE
export interface SingleCourseType {
	ratingSummary: { title: string; value: number }[];
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
	price: number;
	priceCategory: string;
	studentsQuantity: number;
	createdAt: Date;
	slug: string;
	__v: number;
	averageRatings: { [key: string]: number }[];
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
