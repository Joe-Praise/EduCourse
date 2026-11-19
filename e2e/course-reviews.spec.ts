import { test, expect, type Page } from '@playwright/test';

/**
 * Course page reviews: one rating summary (no duplicate block), fed by the
 * backend's per-star percentages, and readable review cards.
 */

const LONG_REVIEW =
	'Clear, practical and well paced. The module on scaffolding inspections changed how our crew runs the morning walk-round, and the checklists are now pinned in the site office. I would have liked a little more on working at height in poor weather, but the examples were grounded in real incidents. Recommended for anyone new to site supervision.';

const baseCourse = {
	_id: 'c1',
	slug: 'site-safety',
	title: 'Site Safety Fundamentals',
	description: 'A practical course on keeping construction sites safe.',
	imageCover: '',
	level: 'Beginner',
	category: { _id: 'k1', name: 'safety', group: 'course' },
	instructors: [],
	studentsQuantity: 12,
	totalLessons: 4,
	duration: '4h',
	price: 0,
	priceCategory: 'Free',
	createdAt: '2026-10-01T00:00:00.000Z',
};

const ratedCourse = {
	...baseCourse,
	ratingsAverage: 4.3,
	ratingsQuantity: 7,
	ratingSummary: [
		{ title: '5', value: 57.142857 },
		{ title: '4', value: 28.571428 },
		{ title: '3', value: 0 },
		{ title: '2', value: 14.285714 },
		{ title: '1', value: 0 },
	],
};

// The backend defaults ratingsAverage to 4.5 for a course nobody has rated.
const unratedCourse = {
	...baseCourse,
	ratingsAverage: 4.5,
	ratingsQuantity: 0,
	ratingSummary: [5, 4, 3, 2, 1].map((n) => ({ title: String(n), value: 0 })),
};

const reviews = [
	{ _id: 'r1', userId: { _id: 'u1', name: 'Amara Okafor', photo: '' }, courseId: 'c1', review: LONG_REVIEW, rating: 5, createdAt: '2026-11-02T10:00:00.000Z' },
	{ _id: 'r2', userId: { _id: 'u2', name: 'Tom Reilly', photo: '' }, courseId: 'c1', review: 'Good overview. The quizzes helped.', rating: 4, createdAt: '2026-10-21T10:00:00.000Z' },
	{ _id: 'r3', userId: { _id: 'u3', name: 'Lena Fischer', photo: '' }, courseId: 'c1', review: '', rating: 2, createdAt: '2026-10-11T10:00:00.000Z' },
];

const json = (body: unknown) => ({
	status: 200,
	contentType: 'application/json',
	body: JSON.stringify(body),
});

const openCourse = async (page: Page, course: object, courseReviews: object[]) => {
	// Registered first so it matches last: any other API call gets an empty success.
	await page.route('**/api/v1/**', (route) => route.fulfill(json({ status: 'success', data: [] })));
	await page.route('**/api/v1/courses?slug=*', (route) =>
		route.fulfill(json({ status: 'success', data: [course], isEnrolled: false })),
	);
	await page.route('**/api/v1/modules?courseId=*', (route) =>
		route.fulfill(json({ status: 'success', data: [] })),
	);
	await page.route('**/api/v1/courses/c1/reviews?*', (route) =>
		route.fulfill(
			json({
				status: 'success',
				data: courseReviews,
				metaData: { totalPages: courseReviews.length ? 1 : 0, totalDocuments: courseReviews.length, count: courseReviews.length, page: 1, limit: 6 },
			}),
		),
	);
	await page.goto('/courses/site-safety');
	const section = page.locator('#reviews');
	// The course page is a lazy route chunk on the dev server; allow a slow first load.
	await expect(section).toBeVisible({ timeout: 15_000 });
	return section;
};

test('shows a single rating summary built from the per-star breakdown', async ({ page }) => {
	const section = await openCourse(page, ratedCourse, reviews);

	await expect(section.getByText('4.3', { exact: true })).toHaveCount(1);
	await expect(section.getByText('7 reviews', { exact: true })).toBeVisible();
	await expect(page.getByText('Students Feedback')).toHaveCount(0);

	const bars = section.getByRole('progressbar');
	await expect(bars).toHaveCount(5);
	const values = await bars.evaluateAll((els) => els.map((el) => el.getAttribute('aria-valuenow')));
	expect(values).toEqual(['57', '29', '0', '14', '0']);
});

test('review cards show stars, a readable date and a working "View more"', async ({ page }) => {
	const section = await openCourse(page, ratedCourse, reviews);

	const cards = section.locator('article');
	await expect(cards).toHaveCount(3);
	await expect(cards.nth(0).getByRole('img', { name: 'Rated 5 out of 5' })).toBeVisible();
	await expect(cards.nth(1).getByRole('img', { name: 'Rated 4 out of 5' })).toBeVisible();
	await expect(cards.nth(2).getByRole('img', { name: 'Rated 2 out of 5' })).toBeVisible();
	await expect(section.getByText(/T10:00:00/)).toHaveCount(0);

	const first = cards.nth(0);
	await expect(first.getByText(/site supervision\.$/)).toHaveCount(0);
	await first.getByRole('button', { name: 'View more' }).click();
	await expect(first.getByText(/site supervision\.$/)).toBeVisible();
	await first.getByRole('button', { name: 'Show less' }).click();
	await expect(first.getByRole('button', { name: 'View more' })).toBeVisible();

	// A rating with no written review renders no empty paragraph or toggle.
	await expect(cards.nth(2).getByRole('button', { name: /View more|Show less/ })).toHaveCount(0);
});

test('the lesson player Reviews tab shows the same single summary', async ({ page, baseURL }) => {
	const student = { _id: 'u9', name: 'Sam Student', email: 'sam@example.com', role: ['user'] };
	const appOrigin = new URL(baseURL ?? 'http://localhost:5173').origin;
	const lesson = { _id: 'l1', title: 'Walk-round basics', url: 'https://www.youtube.com/watch?v=abc', duration: '5:00', lessonIndex: 1, moduleId: 'm1', courseId: 'c1' };

	await page.route((url) => url.origin !== appOrigin, (route) => route.abort());
	await page.route('**/api/v1/**', (route) => route.fulfill(json({ status: 'success', data: [] })));
	await page.route('**/api/v1/users/checkToken', (route) =>
		route.fulfill(json({ status: 'success', token: 'test-token', data: { user: student } })),
	);
	await page.route('**/api/v1/users/me', (route) => route.fulfill(json({ status: 'success', data: student })));
	await page.route('**/api/v1/courses/learn/**', (route) =>
		route.fulfill(json({ status: 'success', data: [{ ...ratedCourse, completedLessons: [], completedCourseId: 'cc1' }] })),
	);
	await page.route('**/api/v1/modules?courseId=*', (route) =>
		route.fulfill(json({ status: 'success', data: [{ _id: 'm1', courseId: 'c1', title: 'Getting started', moduleIndex: 1, lessons: [lesson] }] })),
	);
	await page.route('**/api/v1/courses/c1/reviews?*', (route) =>
		route.fulfill(json({ status: 'success', data: reviews, metaData: { totalPages: 1, totalDocuments: 3, count: 3, page: 1, limit: 6 } })),
	);
	await page.addInitScript((user) => {
		localStorage.setItem('profile', JSON.stringify({ token: 'test-token', user }));
	}, student);

	await page.goto('/courses/site-safety/lecture/c1');
	// Reached and opened from the keyboard: the view tabs are real tab buttons.
	const reviewsTab = page.getByRole('tab', { name: 'Reviews' });
	await reviewsTab.focus({ timeout: 15_000 });
	await page.keyboard.press('Enter');
	await expect(reviewsTab).toHaveAttribute('aria-selected', 'true');

	await expect(page.getByText('7 reviews', { exact: true })).toBeVisible();
	await expect(page.getByRole('progressbar')).toHaveCount(5);
	await expect(page.getByText('4.3', { exact: true })).toHaveCount(1);
	await expect(page.locator('article')).toHaveCount(3);
});

test('an unrated course shows an empty state, not the default 4.5', async ({ page }) => {
	const section = await openCourse(page, unratedCourse, []);

	await expect(section.getByText(/No ratings yet/)).toBeVisible();
	await expect(section.getByText('4.5', { exact: true })).toHaveCount(0);
	await expect(section.getByRole('progressbar')).toHaveCount(0);
	await expect(section.locator('article')).toHaveCount(0);
});
