import { axiosInstance as API } from './utils';
import { handleApiError } from '../../util/helperFunctions/helper';

export interface PlatformStats {
  totalStudents: number;
  totalEnrollments: number;
  totalLessons: number;
  totalPaidToCreators: number;
}

export const getPlatformStatsApi = async () => {
  try {
    const { data } = await API.get('/api/v1/platform/stats');
    return data as { data: PlatformStats; status: string };
  } catch (error) {
    return handleApiError(error);
  }
};
