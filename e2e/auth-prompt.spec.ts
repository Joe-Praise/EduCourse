import { test, expect, type Page } from '@playwright/test';

/**
 * Sign-in gating UX — no backend. Actions that need an account explain why in a
 * dialog (dismissible) instead of bouncing the visitor; sign in / sign up carry
 * the page to come back to; a build requested while signed out resumes after.
 */

const QUERY = 'scaffold safety';

const json = (body: unknown, status = 200) => ({
	status,
	contentType: 'application/json',
	body: JSON.stringify(body),
});

const emptyList = { status: 'success', metaData: { totalPages: 0, totalDocuments: 0, page: 1, count: 0, limit: 12 }, data: [] };

/** Catalog + side lists, empty. `onSearch` answers GET /courses?search=… */
const stubCatalog = async (page: Page, onSearch?: () => unknown) => {
	await page.route('**/api/v1/courses?*', (route) => {
		const url = new URL(route.request().url());
		if (url.searchParams.has('search') && onSearch) return route.fulfill(json(onSearch(), 202));
		return route.fulfill(json(emptyList));
	});
	await page.route('**/api/v1/courses/autocomplete?*', (route) => route.fulfill(json({ status: 'success', data: [] })));
	await page.route('**/api/v1/category?*', (route) => route.fulfill(json(emptyList)));
	await page.route('**/api/v1/instructors?*', (route) => route.fulfill(json(emptyList)));
};

const openBuildPrompt = async (page: Page) => {
	await page.getByRole('textbox', { name: 'Search the catalog' }).fill(QUERY);
	await page.getByRole('button', { name: new RegExp(`Sign in to build "${QUERY}"`) }).click();
	return page.getByRole('dialog');
};

test.describe('Sign-in prompt', () => {
	test('signed-out build opens an explaining dialog that can be dismissed', async ({ page }) => {
		await stubCatalog(page);
		await page.goto('/courses');

		const dialog = await openBuildPrompt(page);
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('heading')).toContainText(`Sign in to build “${QUERY}”`);
		await expect(dialog.getByRole('button', { name: 'Sign in' })).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		expect(new URL(page.url()).pathname).toBe('/courses');

		await (await openBuildPrompt(page)).getByRole('button', { name: 'Not now' }).click();
		await expect(page.getByRole('dialog')).toBeHidden();
	});

	test('choosing an option keeps the way back, across sign-up and sign-in', async ({ page }) => {
		await stubCatalog(page);
		await page.goto('/courses');

		await (await openBuildPrompt(page)).getByRole('button', { name: 'Create an account' }).click();
		await page.waitForURL(/\/signup\?redirect=%2Fcourses$/);

		await page.getByRole('link', { name: 'Sign in' }).last().click();
		await page.waitForURL(/\/signin\?redirect=%2Fcourses$/);
		await expect(page.getByRole('link', { name: 'Create an account' })).toHaveAttribute(
			'href',
			'/signup?redirect=%2Fcourses',
		);
	});

	test('an off-site redirect is ignored', async ({ page }) => {
		await page.goto('/signin?redirect=%2F%2Fevil.example.com');
		await expect(page.getByRole('link', { name: 'Create an account' })).toHaveAttribute('href', '/signup');
	});

	test('a protected page sends you to sign in with the way back', async ({ page }) => {
		await page.goto('/wishlist');
		await page.waitForURL(/\/signin\?redirect=%2Fwishlist$/);
	});

	test('a build asked for while signed out starts on its own once signed in', async ({ page }) => {
		const searches: string[] = [];
		await stubCatalog(page, () => {
			searches.push(QUERY);
			return { status: 'success', data: [{ _id: 'd1', title: QUERY, slug: 'scaffold-safety', publishedStatus: 'importing' }], importing: true, discoveryMessage: `Importing course on "${QUERY}" from YouTube...` };
		});
		await page.route('**/api/v1/users/checkToken', (route) =>
			route.fulfill(json({ status: 'success', token: 'test-token', data: { user: { _id: 'u1', name: 'Ada' } } })),
		);
		await page.route('**/api/v1/users/me', (route) => route.fulfill(json({ status: 'success', data: { _id: 'u1', name: 'Ada' } })));
		await page.route('**/api/v1/wishlist/**', (route) => route.fulfill(json({ status: 'success', data: [] })));

		// State as it is after returning from sign-in: a session, plus the build
		// remembered when they chose "Sign in" in the dialog.
		await page.addInitScript((query) => {
			localStorage.setItem('profile', JSON.stringify({ token: 'test-token', user: { _id: 'u1', name: 'Ada' } }));
			if (!sessionStorage.getItem('e2e-seeded')) {
				sessionStorage.setItem('educourse:pending-import', JSON.stringify({ query, at: Date.now() }));
				sessionStorage.setItem('e2e-seeded', '1');
			}
		}, QUERY);

		await page.goto('/courses');

		await expect(page.getByRole('textbox', { name: 'Search the catalog' })).toHaveValue(QUERY);
		await expect(page.getByText(`Importing course on "${QUERY}" from YouTube...`)).toBeVisible();
		expect(searches.length).toBeGreaterThan(0);
		// Single-use: a reload doesn't start it again.
		expect(await page.evaluate(() => sessionStorage.getItem('educourse:pending-import'))).toBeNull();
	});

	test('an expired stored session on a public page does not bounce you to sign in', async ({ page }) => {
		await stubCatalog(page);
		await page.route('**/api/v1/users/checkToken', (route) =>
			route.fulfill(json({ status: 'fail', message: 'jwt expired' }, 401)),
		);
		await page.addInitScript(() => {
			localStorage.setItem('profile', JSON.stringify({ token: 'expired-token', user: { _id: 'u1' } }));
		});

		await page.goto('/courses');

		await expect(page.getByRole('textbox', { name: 'Search the catalog' })).toBeVisible();
		expect(new URL(page.url()).pathname).toBe('/courses');
	});
});
