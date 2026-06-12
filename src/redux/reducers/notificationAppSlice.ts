import { NotificationType } from '../api/notificationApi';
import { metaData } from '../sharedTypes';
import * as types from '../constants/notificationAppConstants';

type NotificationAppState = {
  notifications: NotificationType[];
  metaData: metaData;
  unreadCount: number;
};

const initialState: NotificationAppState = {
  notifications: [],
  metaData: { totalDocuments: 0, totalPages: 0, page: 0, count: 0, limit: 0 },
  unreadCount: 0,
};

const notificationAppSlice = (state = initialState, action: any): NotificationAppState => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: payload.data ?? [],
        metaData: payload.metaData ?? initialState.metaData,
      };
    case types.GET_NOTIFICATIONS_FAIL:
      return { ...state, notifications: [] };

    case types.GET_UNREAD_COUNT_SUCCESS:
      return { ...state, unreadCount: payload?.count ?? 0 };
    case types.GET_UNREAD_COUNT_FAIL:
      return state;

    case types.MARK_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n._id === payload ? { ...n, read: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case types.MARK_ALL_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };

    case types.DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n._id !== payload),
        metaData: {
          ...state.metaData,
          totalDocuments: Math.max(0, state.metaData.totalDocuments - 1),
        },
      };

    case types.RECEIVE_LIVE_NOTIFICATION: {
      // Server pushed a brand-new notification via SSE. Guard against
      // duplicates (e.g. if the user also just re-fetched the list).
      const incoming = payload as NotificationType;
      if (state.notifications.some((n) => n._id === incoming._id)) return state;
      return {
        ...state,
        notifications: [incoming, ...state.notifications],
        unreadCount: state.unreadCount + (incoming.read ? 0 : 1),
        metaData: {
          ...state.metaData,
          totalDocuments: state.metaData.totalDocuments + 1,
        },
      };
    }

    default:
      return state;
  }
};

export default notificationAppSlice;
