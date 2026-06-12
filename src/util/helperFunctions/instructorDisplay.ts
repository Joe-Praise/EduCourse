/**
 * Single source of truth for rendering an instructor, regardless of whether it
 * is a real platform user (`userId` populated) or a YouTube-imported channel
 * (`source: 'youtube'`, no `userId`, profile fields stored on the doc itself).
 *
 * Before this, components read `instructor.userId.name/photo` directly, which
 * is `undefined` for YouTube instructors → the "undefined's display image"
 * broken section. Use `resolveInstructor()` everywhere instead.
 */

interface UserLike {
	_id?: string;
	name?: string;
	photo?: string;
}

export interface InstructorLike {
	_id?: string;
	userId?: UserLike | null;
	title?: string;
	description?: string;
	source?: string;
	channelName?: string;
	channelThumbnailUrl?: string;
	channelUrl?: string;
	subscriberCount?: number;
}

export interface ResolvedInstructor {
	id: string;
	name: string;
	/** Raw photo value — pass through `imgSrc()` at the call site. May be a
	 *  bare filename (user) or an absolute YouTube avatar URL. */
	photo: string;
	bio: string;
	isYouTube: boolean;
	channelUrl?: string;
	subscriberCount?: number;
	/** Where an instructor click navigates — the /instructors/:id page (shows
	 *  the instructor's taught courses). NOT /user/:id, which is the learner
	 *  ("currently learning across N courses") profile and is wrong for an
	 *  instructor view. Works for both real-user and YouTube instructors. */
	profilePath: string;
}

export const resolveInstructor = (
	instructor: InstructorLike | null | undefined,
): ResolvedInstructor => {
	const user = instructor?.userId ?? null;
	const isYouTube = instructor?.source === 'youtube' || !user;

	const name =
		user?.name ?? instructor?.channelName ?? instructor?.title ?? 'Instructor';
	const photo = user?.photo ?? instructor?.channelThumbnailUrl ?? '';
	const bio = instructor?.description ?? '';
	const id = instructor?._id ?? '';

	const profilePath = id ? `/instructors/${id}` : '/instructors';

	return {
		id,
		name,
		photo,
		bio,
		isYouTube,
		channelUrl: instructor?.channelUrl,
		subscriberCount: instructor?.subscriberCount,
		profilePath,
	};
};
