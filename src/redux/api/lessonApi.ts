import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

/**
 * Lesson CRUD against the Building Safety backend.
 * Routes mounted at `/api/v1/lessons` (see backend `src/Routes/lessonRoutes.ts`).
 * Required fields per backend `lessonModel.ts`:
 *   moduleId, courseId, url (must validate as http/https/ftp), title, duration, lessonIndex.
 * Optional: description (used to store rich Tiptap HTML from the Lesson Builder).
 */

export interface LessonPayload {
	moduleId: string;
	courseId: string;
	title: string;
	url: string;
	duration: string;
	lessonIndex: number;
	description?: string;
}

interface LessonResponse {
	status?: string;
	data?: {
		_id: string;
		moduleId: string;
		courseId: string;
		title: string;
		url: string;
		duration: string;
		lessonIndex: number;
		description?: string;
		[key: string]: unknown;
	};
	error?: string | null;
}

/**
 * Placeholder URL for lessons created from the Course Builder before
 * the instructor has filled in a video/resource URL via the Lesson Builder.
 * Satisfies the backend URL regex so the lesson record can be persisted.
 */
export const LESSON_PLACEHOLDER_URL = 'https://lesson-pending.educourse.local/';

export const createLessonApi = async (payload: LessonPayload): Promise<LessonResponse> => {
	try {
		const { data } = await API.post('/api/v1/lessons', payload);
		return data as LessonResponse;
	} catch (error) {
		return (await handleApiError(error)) as unknown as LessonResponse;
	}
};

export const updateLessonApi = async (
	lessonId: string,
	payload: Partial<LessonPayload>,
): Promise<LessonResponse> => {
	try {
		const { data } = await API.patch(`/api/v1/lessons/${lessonId}`, payload);
		return data as LessonResponse;
	} catch (error) {
		return (await handleApiError(error)) as unknown as LessonResponse;
	}
};

export const getLessonApi = async (lessonId: string): Promise<LessonResponse> => {
	try {
		const { data } = await API.get(`/api/v1/lessons/${lessonId}`);
		return data as LessonResponse;
	} catch (error) {
		return (await handleApiError(error)) as unknown as LessonResponse;
	}
};

export const deleteLessonApi = async (lessonId: string) => {
	try {
		const { data } = await API.delete(`/api/v1/lessons/${lessonId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getLessonsByCourseApi = async (courseId: string) => {
	try {
		const { data } = await API.get(`/api/v1/lessons?courseId=${courseId}&limit=500`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
