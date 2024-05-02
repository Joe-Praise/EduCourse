import { singleBlogType } from './blogApi';
import { categoryType } from './categoryApi';
import { OmittedCourseDataType } from './courseAPI';
import { InstructorType } from './instructorApi';
import { axiosInstance as API } from './utils';
import {
	getSessionStorage,
	saveSessionStorage,
} from '../../util/helperFunctions/helper';
import * as types from '../constants/landingPageConstants';

export type landingPageDataType = {
	courses: OmittedCourseDataType[];
	instructors: InstructorType[];
	categories: categoryType[];
	blogs: singleBlogType[];
};

interface ApiResponse {
	data: landingPageDataType;
	status?: string;
	error: string;
}

export const getLandingPageApi = async (): Promise<ApiResponse> => {
	try {
		const cachedCourses = getSessionStorage(types.LANDING_PAGE_CONST);
		if (cachedCourses) {
			return cachedCourses;
		}

		const url = `/api/v1/`;
		const { data } = await API.get<ApiResponse>(url);

		saveSessionStorage(types.LANDING_PAGE_CONST, data);
		return data;
	} catch (error: any) {
		try {
			const errorMessage =
				error.response?.data?.message || 'An unexpected error occurred.';
			return {
				error: errorMessage,
				data: {
					courses: [],
					instructors: [],
					categories: [],
					blogs: [],
				},
			};
		} catch (err) {
			throw new Error('An unexpected error occurred.');
		}
	}
};
