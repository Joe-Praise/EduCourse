import { ThunkAction } from 'redux-thunk';
import { AppDispatch, RootState } from '../store';
import * as types from '../constants/wishlistConstants';
import * as api from '../api/wishlistApi';
import {
  dispatchErrorHandler,
  throwErrorHandler,
} from '../../util/helperFunctions/helper';

type WishlistThunk = ThunkAction<void, RootState, undefined, any>;

export const getWishlistAction =
  (userId: string, page = '1'): WishlistThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.getWishlistApi(userId, page);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.GET_WISHLIST_SUCCESS, payload: response });
    } catch (err: any) {
      dispatch({ type: types.GET_WISHLIST_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to load wishlist');
    }
  };

export const addToWishlistAction =
  (userId: string, courseId: string): WishlistThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.addToWishlistApi(userId, courseId);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({
        type: types.ADD_TO_WISHLIST_SUCCESS,
        payload: { courseId, wishlistId: response.data?._id },
      });
    } catch (err: any) {
      dispatch({ type: types.ADD_TO_WISHLIST_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to add to wishlist');
    }
  };

export const removeFromWishlistAction =
  (wishlistId: string, courseId: string): WishlistThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.removeFromWishlistApi(wishlistId);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.REMOVE_FROM_WISHLIST_SUCCESS, payload: courseId });
    } catch (err: any) {
      dispatch({ type: types.REMOVE_FROM_WISHLIST_FAIL });
      dispatchErrorHandler(dispatch, err.message || 'Failed to remove from wishlist');
    }
  };

export const checkWishlistAction =
  (userId: string, courseId: string): WishlistThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.checkWishlistApi(userId, courseId);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({
        type: types.CHECK_WISHLIST_SUCCESS,
        payload: {
          courseId,
          wishlisted: !!response.data?.wishlisted,
          wishlistId: response.data?.wishlistId ?? null,
        },
      });
    } catch {
      dispatch({ type: types.CHECK_WISHLIST_FAIL });
    }
  };
