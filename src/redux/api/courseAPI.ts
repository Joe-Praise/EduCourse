import { handleApiError } from '../../util/helperFunctions/helper';
import { metaData, paginateType } from '../sharedTypes';
import { axiosInstance as API } from './utils';

// SINGLE COURSE TYPE STARTS HERE
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
// SINGLE COURSE TYPE ENDS HERE

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
	isEnrolled?: boolean;
	data: OmittedCourseDataType[];
};

interface Course {
	[key: string]: unknown;
}

interface ApiResponse {
	data: Course[];
	status: string;
	isEnrolled: boolean;
	error: string;
}

export interface LectureCourseType {
	userId: string | undefined;
	courseId: string;
}

export const getCourses = async (
	details: paginateType,
	queryString: Partial<string>
): Promise<ApiResponse> => {
	try {
		const { page, limit } = details;
		const url = queryString.length
			? `/api/v1/courses${queryString}&page=${page}&limit=${limit}`
			: `/api/v1/courses?page=${page}&limit=${limit}`;
		const { data } = await API.get<ApiResponse>(url);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getCourseBySlug = async <T>(
	slug: T,
	userId: T
): Promise<ApiResponse> => {
	try {
		const URL = userId
			? `/api/v1/courses?slug=${slug}&userId=${userId}`
			: `/api/v1/courses?slug=${slug}`;
		const { data } = await API.get<ApiResponse>(URL);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

// would be used by the admin dashboard
export const getCouresById = async <T>(courseId: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(`/api/v1/courses/${courseId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getLectureCourse = async (
	details: LectureCourseType
): Promise<ApiResponse> => {
	const { userId, courseId } = details;
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/courses/learn/${userId}/${courseId}`
		);
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

// export const getLectureModules = async <T>(
// 	courseId: T
// ): Promise<ApiResponse> => {
// 	try {
// 		const { data } = await API.get<ApiResponse>(
// 			`/api/v1/modules/lecture?courseId=${courseId}`
// 		);
// 		return data;
// 	} catch (error) {
// 		return handleApiError(error);
// 	}
// };

export const createLectureCourse = async (
	details: LectureCourseType
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
	details: LectureCourseType
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
