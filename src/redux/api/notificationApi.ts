import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export interface NotificationType {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export const getNotificationsApi = async (page = '1', limit = '10') => {
  try {
    const { data } = await API.get(`/api/v1/notifications?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUnreadCountApi = async () => {
  try {
    const { data } = await API.get('/api/v1/notifications/unread-count');
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const markNotificationReadApi = async (notificationId: string) => {
  try {
    const { data } = await API.patch(`/api/v1/notifications/${notificationId}`, { read: true });
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const markAllReadApi = async () => {
  try {
    const { data } = await API.patch('/api/v1/notifications/mark-all-read');
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteNotificationApi = async (notificationId: string) => {
  try {
    const { data } = await API.delete(`/api/v1/notifications/${notificationId}`);
    return { error: null, data };
  } catch (error) {
    return handleApiError(error);
  }
};
