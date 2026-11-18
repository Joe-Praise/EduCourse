import { test, expect } from '@playwright/test';

/**
 * The landing page features the newest courses twice over: the hero collage
 * and the "Editor's selection" rail. They share one list, so the rail must
 * continue after the collage instead of repeating it.
 */

const TITLES = [
	'Scaffold Inspection',
	'Working at Height',
	'Fire Safety Basics',
	'Electrical Isolation',
	'Confined Spaces',
	'Manual Handling',
];

const courses = TITLES.map((title, i) => ({
	_id: `c${i + 1}`,
	slug: `course-${i + 1}`,
	title,
	imageCover: '',
	category: { _id: 'k1', name: 'safety', group: 'course' },
	level: 'Beginner',
	instructors: [],
	ratingsAverage: 4.5,
	ratingsQuantity: 0,
	price: 0,
	priceCategory: 'Free',
	createdAt: '2026-10-01',
}));

const json = (body: unknown) => ({
	status: 200,
	contentType: 'application/json',
	body: JSON.stringify(body),
});

test('"Editor\'s selection" does not repeat the courses featured in the hero', async ({ page }) => {
	// Registered first so it matches last: any other API call gets an empty success.
	await page.route('**/api/v1/**', (route) => route.fulfill(json({ status: 'success', data: [] })));
	await page.route(/\/api\/v1\/$/, (route) =>
		route.fulfill(json({ status: 'success', data: { courses, blogs: [], instructors: [], categories: [] } })),
	);

	await page.goto('/');

	const rail = page.locator('section', { has: page.getByText("Editor's selection.") });
	await expect(rail.locator('[data-rail-card]')).toHaveCount(3, { timeout: 15_000 });
	for (const title of TITLES.slice(3)) {
		await expect(rail.getByText(title, { exact: true })).toHaveCount(1);
	}
	for (const title of TITLES.slice(0, 3)) {
		await expect(rail.getByText(title, { exact: true })).toHaveCount(0);
	}

	const collage = page.locator('[data-hero-collage]');
	await expect(collage.getByText(TITLES[0], { exact: true })).toBeVisible();
	await expect(collage.getByText(TITLES[3], { exact: true })).toHaveCount(0);
});
