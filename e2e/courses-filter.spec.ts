import { test, expect, type Page } from '@playwright/test';

const CATEGORY_ID = '6a2b515b0ffb501e16bcda1e';

const course = {
	_id: 'c1',
	title: 'Advanced Java Tutorials',
	slug: 'advanced-java',
	description: 'A course',
	imageCover: '',
	price: 0,
	priceCategory: 'Free',
	level: 'Beginner',
	ratingsAverage: 5,
	ratingsQuantity: 1,
	studentsQuantity: 2,
	category: { _id: CATEGORY_ID, name: 'Web Development', group: 'course' },
	instructors: [],
	createdAt: '2026-06-12',
};

/**
 * Stub the API the catalog needs. `courses` decides whether the filtered
 * request comes back full or empty — the regression is about what the page
 * does when it comes back EMPTY.
 */
const stubApi = async (page: Page, courses: unknown[]) => {
	await page.route('**/api/v1/courses?*', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				status: 'success',
				metaData: {
					totalPages: courses.length ? 1 : 0,
					totalDocuments: courses.length,
					page: 1,
					count: courses.length,
					limit: 12,
				},
				data: courses,
			}),
		}),
	);
	await page.route('**/api/v1/category?*', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				status: 'success',
				metaData: { totalPages: 1, totalDocuments: 1, page: 1, count: 1, limit: 30 },
				data: [{ _id: CATEGORY_ID, name: 'Web Development', group: 'course' }],
			}),
		}),
	);
	await page.route('**/api/v1/instructors?*', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				status: 'success',
				metaData: { totalPages: 0, totalDocuments: 0, page: 1, count: 0, limit: 10 },
				data: [],
			}),
		}),
	);
};

test.describe('Courses — category filter from a URL', () => {
	test.afterEach(async ({ page }) => {
		await page.unrouteAll({ behavior: 'ignoreErrors' });
	});

	test('a zero-result category settles on the empty state, never endless skeletons', async ({
		page,
	}) => {
		await stubApi(page, []);
		await page.goto(`/courses?category=${CATEGORY_ID}`);

		await expect(page.getByText('No matches.')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear all filters' })).toBeVisible();
		// The filter survives the empty result — it isn't silently dropped.
		await expect(page).toHaveURL(new RegExp(`category=${CATEGORY_ID}`));
	});

	test('a failed request settles too — skeletons never outlive the fetch', async ({ page }) => {
		await stubApi(page, []);
		await page.unroute('**/api/v1/courses?*');
		await page.route('**/api/v1/courses?*', (route) =>
			route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ status: 'error', message: 'Something went very wrong!' }),
			}),
		);
		await page.goto(`/courses?category=${CATEGORY_ID}`);

		await expect(page.getByText('No matches.')).toBeVisible();
	});

	test('arriving at a bare /courses clears a filter left over from an earlier visit', async ({
		page,
	}) => {
		await stubApi(page, [course]);
		await page.goto(`/courses?category=${CATEGORY_ID}`);
		await expect(page.getByText('Category: Web Development')).toBeVisible();

		// In-app nav (no reload) to a plain /courses link — the store still holds
		// the old filter, the URL does not. The URL wins.
		const coursesLink = page.locator('a[href="/courses"]').last();
		await coursesLink.scrollIntoViewIfNeeded();
		await coursesLink.click();

		await expect(page).toHaveURL(/\/courses$/);
		await expect(page.getByText('Category: Web Development')).toHaveCount(0);
	});

	test('a populated category renders its courses behind a named chip', async ({ page }) => {
		await stubApi(page, [course]);
		await page.goto(`/courses?category=${CATEGORY_ID}`);

		await expect(page.getByText('Category: Web Development')).toBeVisible();
		await expect(page.getByText('No matches.')).toHaveCount(0);
		await expect(page.getByRole('link', { name: /Advanced Java Tutorials/ }).first()).toBeVisible();
	});
});
