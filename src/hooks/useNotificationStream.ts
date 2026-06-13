import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { baseURL } from '../redux/api/utils';
import * as types from '../redux/constants/notificationAppConstants';
import { useFeatureFlag } from '../lib/featureFlags';

/**
 * Opens an EventSource against `GET /api/v1/notifications/stream` for the
 * authenticated user and dispatches `RECEIVE_LIVE_NOTIFICATION` on every
 * `notification.created` event the backend pushes.
 *
 * No-op when there's no user. Auto-reconnects on error (browser's native
 * EventSource behavior). Closes cleanly on unmount and on user change.
 *
 * Auth flows via the JWT cookie set during sign-in — EventSource can't set
 * custom headers, so `withCredentials: true` is essential.
 */
export function useNotificationStream(): void {
	const dispatch: AppDispatch = useDispatch();
	const userId = useSelector((state: RootState) => state.user.userObj?._id);
	const enabled = useFeatureFlag('liveNotifications');

	useEffect(() => {
		if (!userId || !enabled) return;

		const url = `${baseURL}/api/v1/notifications/stream`;
		const source = new EventSource(url, { withCredentials: true });

		source.onmessage = (event) => {
			try {
				const parsed = JSON.parse(event.data) as {
					type?: string;
					data?: unknown;
				};
				if (parsed.type === 'notification.created' && parsed.data) {
					dispatch({
						type: types.RECEIVE_LIVE_NOTIFICATION,
						payload: parsed.data,
					});
				}
			} catch {
				// Ignore malformed payloads — heartbeats and connect comments
				// are sent as `:` comments and never reach onmessage anyway.
			}
		};

		source.onerror = () => {
			// EventSource auto-reconnects after errors with exponential backoff.
			// No-op handler — just don't blow up.
		};

		return () => {
			source.close();
		};
	}, [dispatch, userId, enabled]);
}
