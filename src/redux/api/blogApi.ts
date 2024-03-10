import { handleApiError } from '../../util/helperFunctions/helper';
import { ApiResponse, metaData, paginateType } from '../sharedTypes';
import { axiosInstance as API } from './utils';

// SINGLE BLOG TYPE STARTS HERE
export interface singleBlogType {
	_id: string;
	category: Category;
	tag: Tag;
	title: string;
	imageCover?: string;
	description: string;
	summary: string;
	slug: string;
	createdAt: string;
	id: string;
}

export interface Category {
	_id: string;
	name: string;
	group: string;
}

export interface Tag {
	_id: string;
	name: string;
}
type OmittedBlogDataType = Omit<singleBlogType, 'id'>;
// SINGLE BLOG TYPE ENDS HERE

export type blogType = {
	status: string;
	metaData: metaData;
	data: OmittedBlogDataType[];
};

export type blogRequestType = {
	userId: string;
};

// BLOG COMMENT SECTION

export type blogCommentResponseType = {
	status: string;
	metaData: metaData;
	data: OmittedBlogCommentType[];
};
export interface blogCommentType {
	_id: string;
	userId: UserID;
	blogId: string;
	review: string;
	createdAt: string;
	__v: number;
	id: string;
}

export interface UserID {
	_id: string;
	name: string;
	email: string;
	photo: string;
	role: string[];
}

export interface commentRequestType {
	review: string;
}

type OmittedBlogCommentType = Omit<blogCommentType, '__v id'>;

// export interface blogAutoCompleteType {
// 	_id: string;
// 	title: string;
// 	slug: string;
// }

const BASE_URL = '/api/v1/blogs';

export const getBlogs = async (
	details: paginateType,
	queryString: Partial<string>
): Promise<ApiResponse> => {
	try {
		const { page, limit } = details;
		const url = queryString.length
			? `${BASE_URL}${queryString}&page=${page}&limit=${limit}`
			: `${BASE_URL}?page=${page}&limit=${limit}`;
		const { data } = await API.get<ApiResponse>(url);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getBlogBySlug = async <T>(slug: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(`${BASE_URL}?slug=${slug}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

// would be used by the admin dashboard
export const getBlogById = async <T>(blogId: T): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(`${BASE_URL}/${blogId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const createBlog = async (
	details: singleBlogType
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

export const createBlogComment = async (
	details: commentRequestType,
	blogId: string
): Promise<ApiResponse> => {
	try {
		const { data } = await API.post<ApiResponse>(
			`/api/v1/blogs/${blogId}/comments`,
			details
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getBlogComments = async (
	details: paginateType,
	blogId: string
): Promise<ApiResponse> => {
	try {
		const { page, limit } = details;
		const url = `${BASE_URL}/${blogId}/comments?page=${page}&limit=${limit}`;
		const { data } = await API.get<ApiResponse>(url);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const deleteBlogComments = async (
	blogId: string
): Promise<ApiResponse> => {
	const commenBaseUrl = `/api/v1/comments`;
	try {
		const url = `${commenBaseUrl}/${blogId}`;
		const { data } = await API.delete<ApiResponse>(url);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getAutoCompleteAllBlog = async (
	queryString: Partial<string>
): Promise<ApiResponse> => {
	try {
		const { data } = await API.get<ApiResponse>(
			`/api/v1/blogs/autocomplete?query=${queryString}`
		);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

// export const getLectureCourse = async (
// 	details: blogRequestType
// ): Promise<ApiResponse> => {
// 	const { userId } = details;
// 	try {
// 		const { data } = await API.get<ApiResponse>(
// 			`${BASE_URL}/learn/${userId}/${courseId}`
// 		);
// 		return data;
// 	} catch (error) {
// 		return handleApiError(error);
// 	}
// };

// export const getCourseModules = async <T>(
// 	courseId: T
// ): Promise<ApiResponse> => {
// 	try {
// 		const { data } = await API.get<ApiResponse>(
// 			`/api/v1/modules?courseId=${courseId}`
// 		);
// 		return data;
// 	} catch (error) {
// 		return handleApiError(error);
// 	}
// };

// export const checkIsActiveCourse = async (
// 	details: LectureCourseType
// ): Promise<ApiResponse> => {
// 	const { userId, courseId } = details;
// 	try {
// 		const { data } = await API.get<ApiResponse>(
// 			`/api/v1/completed-courses/active/course?courseId=${courseId}&userId=${userId}`
// 		);
// 		return data;
// 	} catch (error) {
// 		return handleApiError(error);
// 	}
// };
