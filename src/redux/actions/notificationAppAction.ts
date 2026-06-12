import { ThunkAction } from 'redux-thunk';
import { AppDispatch, RootState } from '../store';
import * as types from '../constants/notificationAppConstants';
import * as api from '../api/notificationApi';
import { throwErrorHandler } from '../../util/helperFunctions/helper';

type NotificationThunk = ThunkAction<void, RootState, undefined, any>;

export const getNotificationsAction =
  (page = '1'): NotificationThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.getNotificationsApi(page);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.GET_NOTIFICATIONS_SUCCESS, payload: response });
    } catch {
      dispatch({ type: types.GET_NOTIFICATIONS_FAIL });
    }
  };

export const getUnreadCountAction = (): NotificationThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.getUnreadCountApi();
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.GET_UNREAD_COUNT_SUCCESS, payload: response.data });
    } catch {
      dispatch({ type: types.GET_UNREAD_COUNT_FAIL });
    }
  };

export const markNotificationReadAction =
  (notificationId: string): NotificationThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.markNotificationReadApi(notificationId);
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.MARK_NOTIFICATION_READ_SUCCESS, payload: notificationId });
    } catch {
      dispatch({ type: types.MARK_NOTIFICATION_READ_FAIL });
    }
  };

export const markAllReadAction = (): NotificationThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.markAllReadApi();
      const { error } = response;
      throwErrorHandler(error);
      dispatch({ type: types.MARK_ALL_READ_SUCCESS });
    } catch {
      dispatch({ type: types.MARK_ALL_READ_FAIL });
    }
  };

export const deleteNotificationAction =
  (notificationId: string): NotificationThunk =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.deleteNotificationApi(notificationId);
      const { error } = response as any;
      throwErrorHandler(error);
      dispatch({ type: types.DELETE_NOTIFICATION_SUCCESS, payload: notificationId });
    } catch {
      dispatch({ type: types.DELETE_NOTIFICATION_FAIL });
    }
  };
