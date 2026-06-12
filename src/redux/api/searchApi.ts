import { axiosInstance as API } from './utils';
import { handleApiError } from '../../util/helperFunctions/helper';

export interface SearchResultCourse {
	type: 'course';
	_id: string;
	title: string;
	slug: string;
	imageCover?: string;
	level?: string;
	ratingsAverage?: number;
}

export interface SearchResultBlog {
	type: 'blog';
	_id: string;
	title: string;
	slug: string;
	imageCover?: string;
	createdAt?: string;
	category?: { name?: string } | string;
}

export type SearchResult = SearchResultCourse | SearchResultBlog;

export const unifiedSearchApi = async (q: string) => {
	try {
		const { data } = await API.get(`/api/v1/search?q=${encodeURIComponent(q)}`);
		return data as { status: string; data: SearchResult[] };
	} catch (error) {
		return handleApiError(error);
	}
};
