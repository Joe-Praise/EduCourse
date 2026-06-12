import { axiosInstance as API } from './utils';
import { handleApiError } from '../../util/helperFunctions/helper';

export type PreferenceType =
	| 'enrollment'
	| 'review'
	| 'review_alert'
	| 'course_published'
	| 'earning'
	| 'progress_nudge'
	| 'system';

export interface ChannelPair {
	inApp: boolean;
	email: boolean;
}

export interface NotificationPreferences {
	_id?: string;
	userId?: string;
	enabled: boolean;
	enrollment: ChannelPair;
	review: ChannelPair;
	review_alert: ChannelPair;
	course_published: ChannelPair;
	earning: ChannelPair;
	progress_nudge: ChannelPair;
	system: ChannelPair;
}

export type PreferencesPatch = Partial<{
	enabled: boolean;
	enrollment: Partial<ChannelPair>;
	review: Partial<ChannelPair>;
	review_alert: Partial<ChannelPair>;
	course_published: Partial<ChannelPair>;
	earning: Partial<ChannelPair>;
	progress_nudge: Partial<ChannelPair>;
	system: Partial<ChannelPair>;
}>;

export const getMyNotificationPreferencesApi = async () => {
	try {
		const { data } = await API.get('/api/v1/notifications/preferences');
		return data as { status: string; data: NotificationPreferences };
	} catch (error) {
		return handleApiError(error);
	}
};

export const updateMyNotificationPreferencesApi = async (patch: PreferencesPatch) => {
	try {
		const { data } = await API.patch('/api/v1/notifications/preferences', patch);
		return data as { status: string; data: NotificationPreferences };
	} catch (error) {
		return handleApiError(error);
	}
};
