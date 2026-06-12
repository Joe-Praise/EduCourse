import { getSingleCourseByIdApi } from '../../redux/api/instructorDashboardApi';
import { getModulesByCourseApi } from '../../redux/api/moduleApi';
import { getLessonsByCourseApi, LESSON_PLACEHOLDER_URL } from '../../redux/api/lessonApi';
import { baseURL } from '../../redux/api/utils';
import { CourseDraft, BuilderModule, BuilderLesson, CourseLevel, EMPTY_DRAFT } from './types';

function mapLevel(raw: string | undefined): CourseLevel {
	const s = (raw ?? '').toLowerCase();
	if (s.includes('beginner')) return 'beginner';
	if (s.includes('intermediate')) return 'intermediate';
	if (s.includes('advanced')) return 'advanced';
	return 'all-levels';
}

export async function loadEditDraft(courseId: string): Promise<CourseDraft | null> {
	try {
		const [courseRes, modulesRes, lessonsRes] = await Promise.all([
			getSingleCourseByIdApi(courseId),
			getModulesByCourseApi(courseId),
			getLessonsByCourseApi(courseId),
		]);

		// getCourse returns { status, data: [{...courseFields}] } (array wrapped)
		const course = Array.isArray(courseRes?.data) ? courseRes.data[0] : courseRes?.data;
		if (!course) return null;

		const backendModules: Record<string, unknown>[] = modulesRes?.data ?? [];
		const backendLessons: Record<string, unknown>[] = lessonsRes?.data ?? [];

		// Group lessons by moduleId
		const lessonsByModule: Record<string, Record<string, unknown>[]> = {};
		for (const lesson of backendLessons) {
			const mid = String(
				(lesson.moduleId as Record<string, unknown>)?._id ?? lesson.moduleId,
			);
			if (!lessonsByModule[mid]) lessonsByModule[mid] = [];
			lessonsByModule[mid].push(lesson);
		}

		const sortedModules = [...backendModules].sort(
			(a, b) => ((a.moduleIndex as number) ?? 0) - ((b.moduleIndex as number) ?? 0),
		);

		const modules: BuilderModule[] = sortedModules.map((mod) => {
			const mid = String(mod._id);
			const lessons: BuilderLesson[] = (lessonsByModule[mid] ?? [])
				.sort(
					(a, b) =>
						((a.lessonIndex as number) ?? 0) - ((b.lessonIndex as number) ?? 0),
				)
				.map((l) => ({
					id: String(l._id),
					title: String(l.title ?? ''),
					url:
						l.url && l.url !== LESSON_PLACEHOLDER_URL
							? String(l.url)
							: undefined,
					duration: String(l.duration ?? ''),
				}));
			return { id: mid, title: String(mod.title ?? ''), lessons };
		});

		const pricingType: 'free' | 'paid' =
			course.priceCategory === 'Free' || (course.price as number) === 0
				? 'free'
				: 'paid';

		const categoryId =
			typeof course.category === 'object' && course.category !== null
				? String((course.category as Record<string, unknown>)._id ?? '')
				: String(course.category ?? '');

		const coverImage = course.imageCover
			? `${baseURL}/img/${course.imageCover}`
			: null;

		return {
			...EMPTY_DRAFT,
			title: String(course.title ?? ''),
			slug: String(course.slug ?? ''),
			categoryId,
			level: mapLevel(course.level as string | undefined),
			modules,
			pricingType,
			price: (course.price as number) ?? 0,
			discountPrice: (course.priceDiscount as number) ?? null,
			coverImage,
			longDescription: String(course.description ?? ''),
		};
	} catch (err) {
		console.error('[loadEditDraft] failed to load course', courseId, err);
		return null;
	}
}
