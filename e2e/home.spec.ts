import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
	test('renders the landing experience with hero + nav', async ({ page }) => {
		await page.goto('/');

		// Header wordmark — sanity check that the editorial chrome rendered.
		await expect(page.getByRole('link', { name: 'EduCourse' }).first()).toBeVisible();

		// Menu button is the main nav affordance.
		await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
	});

	test('menu reveals primary nav links including Search', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: 'Open menu' }).click();

		// Each item is rendered as a link; some have label + accent so we
		// match the link by its accessible name starting with the label.
		await expect(page.getByRole('link', { name: /Home/ }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /Courses/ }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /Search/ }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /FAQ/ }).first()).toBeVisible();
	});

	test('NotFound page renders the editorial 404', async ({ page }) => {
		const response = await page.goto('/this-route-definitely-does-not-exist');
		// SPA returns 200 for any route — content check matters more than status.
		expect(response).toBeTruthy();
		await expect(page.getByText('Off the page')).toBeVisible();
		await expect(page.getByRole('link', { name: /Take me home/ })).toBeVisible();
	});
});
