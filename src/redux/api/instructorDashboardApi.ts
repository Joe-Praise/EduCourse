import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export interface DashboardByCourse {
  _id: string;
  courseTitle: string;
  courseSlug: string;
  courseCover: string;
  publishedStatus: 'draft' | 'review' | 'published' | 'archived';
  totalEarning: number;
  enrollmentCount: number;
}

export interface DashboardOverviewType {
  totalStudents: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  byCourse: DashboardByCourse[];
  recentEnrollments: any[];
}

export interface InstructorCourseType {
  _id: string;
  title: string;
  slug: string;
  imageCover: string;
  publishedStatus: 'draft' | 'review' | 'published' | 'archived';
  studentsQuantity: number;
  ratingsAverage: number;
  totalRevenue: number;
  price: number;
}

export interface EarningType {
  _id: string;
  courseId: { _id: string; title: string };
  amount: number;
  netEarning: number;
  status: string;
  createdAt: string;
}

export const getDashboardOverviewApi = async () => {
  try {
    const { data } = await API.get('/api/v1/earnings/dashboard');
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getInstructorCoursesApi = async (instructorId: string, page = '1') => {
  try {
    const { data } = await API.get(
      `/api/v1/courses?instructors=${instructorId}&page=${page}`,
    );
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateInstructorProfileApi = async (payload: Record<string, any>) => {
  try {
    const { data } = await API.patch('/api/v1/instructors/updateMe', payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const submitCourseForReviewApi = async (courseId: string) => {
  try {
    const { data } = await API.patch(`/api/v1/courses/${courseId}/submit-review`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMyInstructorProfileApi = async (userId: string) => {
  try {
    const { data } = await API.get(`/api/v1/instructors?userId=${userId}&limit=1`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export interface CourseFormPayload {
  title: string;
  description: string;
  priceCategory: 'Free' | 'Paid';
  price: number;
  level: string;
  category: string;
  duration: string;
  // v2.1 — extended to match backend Course model fields
  priceDiscount?: number;
  instructors?: string[];
  totalLessons?: number;
}

interface CourseCreateResponse {
  status?: string;
  data?: { _id: string; slug: string; [key: string]: unknown };
  error?: string | null;
}

export const createCourseApi = async (payload: CourseFormPayload): Promise<CourseCreateResponse> => {
  try {
    const { data } = await API.post('/api/v1/courses', payload);
    return data as CourseCreateResponse;
  } catch (error) {
    return (await handleApiError(error)) as unknown as CourseCreateResponse;
  }
};

export const updateCourseApi = async (courseId: string, payload: Partial<CourseFormPayload>) => {
  try {
    const { data } = await API.patch(`/api/v1/courses/${courseId}`, payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Uploads a cover image to an existing course via the backend multer endpoint.
 * Backend: PATCH /api/v1/courses/:id/resources with FormData field `imageCover`.
 */
export const uploadCourseCoverApi = async (courseId: string, file: File) => {
  try {
    const fd = new FormData();
    fd.append('imageCover', file);
    const { data } = await API.patch(`/api/v1/courses/${courseId}/resources`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getSingleCourseByIdApi = async (courseId: string) => {
  try {
    const { data } = await API.get(`/api/v1/courses/${courseId}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getInstructorEarningsApi = async (
  instructorId: string,
  page = '1',
  limit = '10',
) => {
  try {
    const { data } = await API.get(
      `/api/v1/earnings?instructorId=${instructorId}&page=${page}&limit=${limit}`,
    );
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export interface ActivityItem {
  id: string;
  type: 'enrollment' | 'review' | 'completion' | 'payout';
  personName?: string;
  courseTitle?: string;
  rating?: number;
  amount?: number;
  timestamp: string;
}

export interface HeatmapCell {
  day: number;
  hour: number;
  value: number;
}

export const getActivityFeedApi = async () => {
  try {
    const { data } = await API.get('/api/v1/earnings/activity');
    return data as { data: ActivityItem[]; status: string };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getEngagementHeatmapApi = async () => {
  try {
    const { data } = await API.get('/api/v1/earnings/engagement');
    return data as { data: HeatmapCell[]; status: string };
  } catch (error) {
    return handleApiError(error);
  }
};
