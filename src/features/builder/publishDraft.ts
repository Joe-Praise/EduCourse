import {
	createCourseApi,
	updateCourseApi,
	uploadCourseCoverApi,
	type CourseFormPayload,
} from '../../redux/api/instructorDashboardApi';
import {
	createModuleApi,
	updateModuleApi,
	deleteModuleApi,
	getModulesByCourseApi,
} from '../../redux/api/moduleApi';
import {
	createLessonApi,
	updateLessonApi,
	deleteLessonApi,
	getLessonsByCourseApi,
	LESSON_PLACEHOLDER_URL,
} from '../../redux/api/lessonApi';
import { submitCourseForReviewApi } from '../../redux/api/instructorDashboardApi';
import { type CourseDraft } from './types';

/** MongoDB ObjectIds are 24-char hex strings. Draft-generated ids contain "-". */
const isBackendId = (id: string) => /^[0-9a-f]{24}$/i.test(id);

interface PublishOptions {
	instructorId?: string;
	submitForReview?: boolean;
	onProgress?: (step: PublishStep) => void;
}

export type PublishStep =
	| { kind: 'creating-course' }
	| { kind: 'uploading-cover' }
	| { kind: 'creating-modules'; total: number }
	| { kind: 'creating-lessons'; total: number }
	| { kind: 'submitting-for-review' }
	| { kind: 'done'; courseId: string; slug: string };

export interface PublishResult {
	courseId: string;
	slug: string;
	moduleCount: number;
	lessonCount: number;
}

export interface PublishError {
	message: string;
	step: PublishStep['kind'];
}

const mapLevel = (level: CourseDraft['level']): string => {
	switch (level) {
		case 'all-levels':
			return 'All Levels';
		case 'beginner':
			return 'Beginner';
		case 'intermediate':
			return 'Intermediate';
		case 'advanced':
			return 'Advanced';
		default:
			return 'All Levels';
	}
};

const buildDescription = (draft: CourseDraft): string => {
	const blocks: string[] = [];
	if (draft.shortDescription.trim()) blocks.push(`<p>${escapeHtml(draft.shortDescription.trim())}</p>`);
	if (draft.longDescription.trim()) blocks.push(draft.longDescription);
	const outcomes = draft.outcomes.filter((o) => o.trim().length > 0);
	if (outcomes.length > 0) {
		blocks.push(
			`<h3>What you'll learn</h3><ul>${outcomes
				.map((o) => `<li>${escapeHtml(o.trim())}</li>`)
				.join('')}</ul>`,
		);
	}
	if (draft.prerequisites.trim()) {
		blocks.push(`<h3>Prerequisites</h3><p>${escapeHtml(draft.prerequisites.trim())}</p>`);
	}
	if (draft.targetAudience.trim()) {
		blocks.push(`<h3>Who this is for</h3><p>${escapeHtml(draft.targetAudience.trim())}</p>`);
	}
	if (draft.promoVideoUrl.trim()) {
		blocks.push(`<p><a href="${escapeHtml(draft.promoVideoUrl.trim())}" target="_blank" rel="noopener noreferrer">Watch the promo video</a></p>`);
	}
	return blocks.join('\n\n') || '<p>No description yet.</p>';
};

const escapeHtml = (s: string): string =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const sumLessonMinutes = (draft: CourseDraft): number => {
	let total = 0;
	for (const m of draft.modules) {
		for (const l of m.lessons) {
			if (!l.duration) continue;
			const parts = l.duration.split(':').map((n) => parseInt(n, 10));
			if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
				total += parts[0] + parts[1] / 60;
			} else if (parts.length === 1 && !Number.isNaN(parts[0])) {
				total += parts[0];
			}
		}
	}
	return Math.round(total);
};

const formatDuration = (minutes: number): string => {
	if (minutes === 0) return '—';
	if (minutes < 60) return `${minutes} min`;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
	const res = await fetch(dataUrl);
	const blob = await res.blob();
	return new File([blob], filename, { type: blob.type || 'image/jpeg' });
};

const draftToCoursePayload = (draft: CourseDraft, instructorId?: string): CourseFormPayload => {
	const totalLessons = draft.modules.reduce((sum, m) => sum + m.lessons.length, 0);
	const minutes = sumLessonMinutes(draft);
	return {
		title: draft.title.trim(),
		description: buildDescription(draft),
		priceCategory: draft.pricingType === 'free' ? 'Free' : 'Paid',
		price: draft.pricingType === 'free' ? 0 : draft.price,
		priceDiscount: draft.discountPrice ?? undefined,
		level: mapLevel(draft.level),
		category: draft.categoryId,
		duration: formatDuration(minutes),
		totalLessons,
		instructors: instructorId ? [instructorId] : undefined,
	};
};

/**
 * Publish a draft to the backend in sequence:
 *   1. POST /courses (rich payload)
 *   2. PATCH /courses/:id/resources (cover, if data URL present)
 *   3. POST /modules for each module (with moduleIndex)
 *   4. POST /lessons for each lesson with a placeholder URL (instructor refines via Lesson Builder)
 *   5. (Optional) PATCH /courses/:id/submit-review
 */
export async function publishDraft(
	draft: CourseDraft,
	{ instructorId, submitForReview = false, onProgress }: PublishOptions = {},
): Promise<PublishResult> {
	const tick = (step: PublishStep) => onProgress?.(step);

	// 1. Course
	tick({ kind: 'creating-course' });
	const coursePayload = draftToCoursePayload(draft, instructorId);
	const courseRes = await createCourseApi(coursePayload);
	if (courseRes.error || !courseRes.data?._id) {
		throw publishError(courseRes.error ?? 'Could not create course', 'creating-course');
	}
	const courseId = courseRes.data._id;
	const slug = courseRes.data.slug;

	// 2. Cover image (optional)
	if (draft.coverImage) {
		tick({ kind: 'uploading-cover' });
		try {
			const file = await dataUrlToFile(draft.coverImage, `cover-${slug}.jpg`);
			await uploadCourseCoverApi(courseId, file);
		} catch (err) {
			// Non-fatal — surface but keep going.
			console.warn('Cover upload failed; continuing publish', err);
		}
	}

	// 3. Modules
	tick({ kind: 'creating-modules', total: draft.modules.length });
	const createdModuleIds: Array<{ draftId: string; backendId: string }> = [];
	for (let i = 0; i < draft.modules.length; i++) {
		const module = draft.modules[i];
		const res = await createModuleApi({
			courseId,
			title: module.title.trim() || `Module ${i + 1}`,
			moduleIndex: i,
			section: module.title.trim() || `Section ${i + 1}`,
		});
		if (res.error || !res.data?._id) {
			throw publishError(res.error ?? `Could not create module "${module.title}"`, 'creating-modules');
		}
		createdModuleIds.push({ draftId: module.id, backendId: res.data._id });
	}

	// 4. Lessons (placeholder URL — instructor sets real content via Lesson Builder)
	const totalLessons = draft.modules.reduce((sum, m) => sum + m.lessons.length, 0);
	tick({ kind: 'creating-lessons', total: totalLessons });
	for (let mi = 0; mi < draft.modules.length; mi++) {
		const module = draft.modules[mi];
		const backendModuleId = createdModuleIds[mi].backendId;
		for (let li = 0; li < module.lessons.length; li++) {
			const lesson = module.lessons[li];
			const res = await createLessonApi({
				moduleId: backendModuleId,
				courseId,
				title: lesson.title.trim() || `Lesson ${li + 1}`,
				url: lesson.url?.trim() || LESSON_PLACEHOLDER_URL,
				duration: lesson.duration || '0:00',
				lessonIndex: li,
			});
			if (res.error) {
				throw publishError(res.error ?? `Could not create lesson "${lesson.title}"`, 'creating-lessons');
			}
		}
	}

	// 5. Optional submit-for-review
	if (submitForReview) {
		tick({ kind: 'submitting-for-review' });
		const res = await submitCourseForReviewApi(courseId);
		if (res?.error) {
			throw publishError(res.error, 'submitting-for-review');
		}
	}

	const result: PublishResult = {
		courseId,
		slug,
		moduleCount: draft.modules.length,
		lessonCount: totalLessons,
	};
	tick({ kind: 'done', courseId, slug });
	return result;
}

const publishError = (message: string, step: PublishStep['kind']): Error => {
	const err = new Error(message) as Error & PublishError;
	err.step = step;
	return err;
};

/**
 * Saves changes to an existing course:
 *   1. PATCH course metadata
 *   2. Re-upload cover only when the instructor chose a new image (data URL)
 *   3. Sync modules — create new, update existing titles/order, delete removed
 *   4. Sync lessons — create new, update existing fields, delete removed
 *
 * New items (added in the draft) have dash-containing ids from newId().
 * Existing items (loaded from the backend) have 24-char hex MongoDB ObjectIds.
 */
export async function updateDraft(courseId: string, draft: CourseDraft): Promise<void> {
	const minutes = sumLessonMinutes(draft);
	const totalLessons = draft.modules.reduce((sum, m) => sum + m.lessons.length, 0);

	// 1. Update course metadata
	await updateCourseApi(courseId, {
		title: draft.title.trim(),
		description: buildDescription(draft),
		priceCategory: draft.pricingType === 'free' ? 'Free' : 'Paid',
		price: draft.price,
		priceDiscount: draft.discountPrice ?? undefined,
		level: mapLevel(draft.level),
		category: draft.categoryId,
		duration: formatDuration(minutes),
		totalLessons,
	});

	// 2. Cover re-upload (only for newly selected images)
	if (draft.coverImage?.startsWith('data:')) {
		try {
			const file = await dataUrlToFile(draft.coverImage, 'cover.jpg');
			await uploadCourseCoverApi(courseId, file);
		} catch (err) {
			console.warn('Cover upload failed; continuing', err);
		}
	}

	// 3. Fetch current backend state for diffing
	const [currentModulesRes, currentLessonsRes] = await Promise.all([
		getModulesByCourseApi(courseId),
		getLessonsByCourseApi(courseId),
	]);

	const currentModuleIds = new Set<string>(
		(currentModulesRes?.data ?? []).map((m: Record<string, unknown>) => String(m._id)),
	);
	const currentLessonIds = new Set<string>(
		(currentLessonsRes?.data ?? []).map((l: Record<string, unknown>) => String(l._id)),
	);

	// 4. Sync modules (sequential — new modules must exist before their lessons are created)
	const draftModuleBackendIds = new Set<string>();
	const draftLessonBackendIds = new Set<string>();

	for (let mi = 0; mi < draft.modules.length; mi++) {
		const module = draft.modules[mi];
		let backendModuleId: string;

		if (isBackendId(module.id)) {
			// Existing module — update title and order
			backendModuleId = module.id;
			draftModuleBackendIds.add(module.id);
			await updateModuleApi(module.id, {
				title: module.title.trim() || `Module ${mi + 1}`,
				moduleIndex: mi,
			});
		} else {
			// New module — create it
			const res = await createModuleApi({
				courseId,
				title: module.title.trim() || `Module ${mi + 1}`,
				moduleIndex: mi,
				section: module.title.trim() || `Section ${mi + 1}`,
			});
			if (res.error || !res.data?._id) {
				throw new Error(res.error ?? `Could not create module "${module.title}"`);
			}
			backendModuleId = res.data._id;
		}

		// 5. Sync lessons within this module
		for (let li = 0; li < module.lessons.length; li++) {
			const lesson = module.lessons[li];

			if (isBackendId(lesson.id)) {
				draftLessonBackendIds.add(lesson.id);
				await updateLessonApi(lesson.id, {
					title: lesson.title.trim() || `Lesson ${li + 1}`,
					url: lesson.url?.trim() || LESSON_PLACEHOLDER_URL,
					duration: lesson.duration || '0:00',
					lessonIndex: li,
				});
			} else {
				// New lesson — create it under the (possibly just-created) module
				await createLessonApi({
					moduleId: backendModuleId,
					courseId,
					title: lesson.title.trim() || `Lesson ${li + 1}`,
					url: lesson.url?.trim() || LESSON_PLACEHOLDER_URL,
					duration: lesson.duration || '0:00',
					lessonIndex: li,
				});
			}
		}
	}

	// 6. Delete modules removed from the draft
	for (const mid of Array.from(currentModuleIds)) {
		if (!draftModuleBackendIds.has(mid)) {
			await deleteModuleApi(mid);
		}
	}

	// 7. Delete lessons removed from the draft
	for (const lid of Array.from(currentLessonIds)) {
		if (!draftLessonBackendIds.has(lid)) {
			await deleteLessonApi(lid);
		}
	}
}
