import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export interface EnrollmentPayload {
  userId: string;
  courseId: string;
  amount?: number;
}

export const createEnrollmentApi = async (payload: EnrollmentPayload) => {
  try {
    const { data } = await API.post('/api/v1/enrollments', payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const checkEnrollmentApi = async (userId: string, courseId: string) => {
  try {
    const { data } = await API.get(`/api/v1/enrollments/check?userId=${userId}&courseId=${courseId}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getProgressSummaryApi = async (userId: string, courseId: string) => {
  try {
    const { data } = await API.get(`/api/v1/completed-courses/progress/${userId}/${courseId}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};
