import { handleApiError } from '../../util/helperFunctions/helper';
import { axiosInstance as API } from './utils';

export const getWishlistApi = async (userId: string, page = '1') => {
  try {
    const { data } = await API.get(`/api/v1/wishlist?userId=${userId}&page=${page}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const addToWishlistApi = async (userId: string, courseId: string) => {
  try {
    const { data } = await API.post('/api/v1/wishlist', { userId, courseId });
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const removeFromWishlistApi = async (wishlistId: string) => {
  try {
    const { data } = await API.delete(`/api/v1/wishlist/${wishlistId}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const checkWishlistApi = async (userId: string, courseId: string) => {
  try {
    const { data } = await API.get(`/api/v1/wishlist/check?userId=${userId}&courseId=${courseId}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};
