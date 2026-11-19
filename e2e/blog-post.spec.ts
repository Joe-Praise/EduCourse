import { test, expect } from '@playwright/test';

/**
 * Blog post page: one byline, no placeholder "About the author" card (the API
 * has no author data), and comment avatars aligned with the commenter's name.
 */

const blog = {
	_id: 'b1',
	slug: 'fall-protection',
	title: 'Fall protection that crews actually use',
	summary: 'Harness checks, anchor points and the habits that stick.',
	description: '<p>Most falls happen on short jobs. Plan the anchor before the ladder goes up.</p>',
	imageCover: '',
	category: { _id: 'k2', name: 'safety', group: 'blog' },
	tag: [{ _id: 't1', name: 'height' }],
	commentsQuantity: 1,
	createdAt: '2026-10-05T09:00:00.000Z',
	updatedAt: '2026-10-05T09:00:00.000Z',
};

const comment = {
	_id: 'cm1',
	blogId: 'b1',
	userId: { _id: 'u1', name: 'Amara Okafor', photo: '' },
	review:
		'We moved anchor planning into the pre-start briefing after reading this. Two near-misses last quarter, none since. The ladder checklist is pinned in the site office now and the apprentices actually use it, which is the real win for us.',
	createdAt: '2026-10-06T09:00:00.000Z',
};

const json = (body: unknown) => ({
	status: 200,
	contentType: 'application/json',
	body: JSON.stringify(body),
});

test('a blog post has one byline, no placeholder author card, and aligned comment avatars', async ({ page }) => {
	// Registered first so it matches last: any other API call gets an empty success.
	await page.route('**/api/v1/**', (route) => route.fulfill(json({ status: 'success', data: [] })));
	await page.route('**/api/v1/blogs?slug=*', (route) => route.fulfill(json({ status: 'success', data: [blog] })));
	await page.route('**/api/v1/blogs/b1/comments?*', (route) =>
		route.fulfill(
			json({
				status: 'success',
				data: [comment],
				metaData: { totalPages: 1, totalDocuments: 1, count: 1, page: 1, limit: 6 },
			}),
		),
	);

	await page.goto('/blogs/fall-protection');
	// The post is a lazy route chunk on the dev server; allow a slow first load.
	await expect(page.getByRole('heading', { name: blog.title })).toBeVisible({ timeout: 15_000 });

	await expect(page.getByText('Written by', { exact: true })).toHaveCount(1);
	await expect(page.getByText('About the author')).toHaveCount(0);
	await expect(page.getByText(/Practice over theory/)).toHaveCount(0);

	const card = page.locator('article', { hasText: 'Amara Okafor' });
	await card.scrollIntoViewIfNeeded();
	const cardBox = await card.boundingBox();
	const avatarBox = await card.getByText('AO', { exact: true }).boundingBox();
	expect(cardBox && avatarBox).toBeTruthy();
	// Top-aligned with the name, not floating at the card's vertical middle.
	expect(avatarBox!.y - cardBox!.y).toBeLessThan(24);
});
