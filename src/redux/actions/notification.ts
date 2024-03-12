import * as types from '../constants/notificationConstants';

export interface notificationType {
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error' | 'default';
	id?: string;
}

export const addNotification = (details: notificationType) => {
	return {
		type: types.ADD_NOTIFICATION_SUCCESS,
		payload: details,
	};
};

export const clearNotification = () => {
	return {
		type: types.CLEAR_NOTIFICATION,
	};
};
