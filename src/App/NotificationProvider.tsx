import { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateOptions, toast } from 'react-toastify';
import { AppDispatch, RootState } from '../redux/store';
import { clearNotification } from '../redux/actions/notification';

interface Iprop {
	children: ReactNode;
}

const NotificationProvider = (props: Iprop) => {
	const { children } = props;
	const Toast = toast;
	const dispatch: AppDispatch = useDispatch();
	const notifications = useSelector(
		(state: RootState) => state.notification.notification
	);

	useEffect(() => {
		if (notifications.length > 0) {
			notifications.forEach(({ message, type, id }) => {
				if (id) {
					Toast.update(id, {
						message,
						type,
						isLoading: false,
						closeButton: true,
						autoClose: 3000,
					} as UpdateOptions<{ message: string }>);
				} else {
					Toast(message, {
						type,
					});
				}
			});
			dispatch(clearNotification());
		}
	}, [dispatch, notifications, Toast]);

	return <>{children}</>;
};

export default NotificationProvider;
