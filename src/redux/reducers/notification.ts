import * as types from '../constants/notificationConstants';
import { notificationType } from '../actions/notification';

type notificationState = {
	notification: notificationType[];
};

const initialState: notificationState = {
	notification: [],
};

const userSlice = (state = initialState, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case types.ADD_NOTIFICATION_SUCCESS:
			return {
				notification: [...state.notification, payload],
			};
		case types.CLEAR_NOTIFICATION:
			return {
				...state,
				notification: [],
			};
		default:
			return state;
	}
};

export default userSlice;
