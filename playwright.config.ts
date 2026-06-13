import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config.
 *
 * Runs against a locally-served Vite dev server by default. CI can override
 * `PLAYWRIGHT_BASE_URL` to test a deployed environment.
 *
 * Strategy: lightweight smoke tests on critical user-visible paths. We don't
 * stand up a real backend in CI — tests that NEED the API (enrollment,
 * reviews, etc) are skipped unless `PLAYWRIGHT_API_BASE` is set. The smoke
 * tests here run against the frontend only and verify the editorial chrome
 * + form validation work end-to-end.
 */
export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	expect: { timeout: 5_000 },
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: process.env.CI ? [['github'], ['list']] : 'list',

	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		// Add `firefox` / `webkit` here when the test matrix expands. Keeping
		// chromium-only initially keeps CI runs fast.
	],

	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: 'npm run dev',
				url: 'http://localhost:5173',
				reuseExistingServer: !process.env.CI,
				timeout: 60_000,
			},
});
