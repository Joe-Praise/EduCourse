import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

/**
 * Module CRUD against the Building Safety backend.
 * Routes mounted at `/api/v1/modules` (see backend `src/Routes/moduleRoutes.ts`).
 * Required fields per backend `courseModuleModel.ts`: courseId, title, moduleIndex, section.
 */

export interface ModulePayload {
	courseId: string;
	title: string;
	moduleIndex: number;
	section: string;
}

interface ModuleResponse {
	status?: string;
	data?: { _id: string; courseId: string; title: string; moduleIndex: number; [key: string]: unknown };
	error?: string | null;
}

export const createModuleApi = async (payload: ModulePayload): Promise<ModuleResponse> => {
	try {
		const { data } = await API.post('/api/v1/modules', payload);
		return data as ModuleResponse;
	} catch (error) {
		return (await handleApiError(error)) as unknown as ModuleResponse;
	}
};

export const updateModuleApi = async (
	moduleId: string,
	payload: Partial<ModulePayload>,
): Promise<ModuleResponse> => {
	try {
		const { data } = await API.patch(`/api/v1/modules/${moduleId}`, payload);
		return data as ModuleResponse;
	} catch (error) {
		return (await handleApiError(error)) as unknown as ModuleResponse;
	}
};

export const deleteModuleApi = async (moduleId: string) => {
	try {
		const { data } = await API.delete(`/api/v1/modules/${moduleId}`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};

export const getModulesByCourseApi = async (courseId: string) => {
	try {
		const { data } = await API.get(`/api/v1/modules?courseId=${courseId}&limit=100`);
		return data;
	} catch (error) {
		return handleApiError(error);
	}
};
