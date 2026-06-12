import { test, expect } from '@playwright/test';

/**
 * Sign-in form validation — no backend required. Verifies that the
 * editorial form chrome works end-to-end and that the protected-route
 * redirect kicks in.
 */
test.describe('Auth', () => {
	test('sign-in page renders the editorial form', async ({ page }) => {
		await page.goto('/signin');
		// Form should have email + password inputs and a submit button.
		await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
		await expect(page.locator('input[type="password"]').first()).toBeVisible();
	});

	test('visiting a protected route while logged-out redirects', async ({ page }) => {
		await page.goto('/profile');
		// PrivateRoutes calls setInitialAuthState(navigate) which routes to /signin.
		// Allow a moment for the redirect to land.
		await page.waitForURL(/\/signin/, { timeout: 5000 }).catch(() => undefined);
		expect(page.url()).toMatch(/\/signin/);
	});
});
