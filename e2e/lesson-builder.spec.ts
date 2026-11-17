import { test, expect, type Page } from '@playwright/test';
import { CODE_BLOCK_CLASS, DESCRIPTIONS, PUNCTUATION, type DescriptionCase } from './fixtures/lessonDescriptions';

/**
 * Lesson Builder ↔ plain-text lesson descriptions, against a stubbed lessons API.
 *
 * The backend stores descriptions as plain text. The builder must load that text
 * as text (never as HTML) and save it back so the backend stores the same text.
 * Each save is checked against the HTML in the fixtures, whose mapping back to
 * plain text the backend test suite asserts.
 */

const LESSON_ID = '650000000000000000000001';
const TITLE = 'Generics <T> & Map<K, V>';
const VIDEO_URL = 'https://www.youtube.com/watch?v=abcDEF12345';
const INSTRUCTOR = { _id: 'u1', name: 'Ada', role: ['instructor'] };
const DRAFT_KEY = `educourse:lesson-draft:${LESSON_ID}`;

const json = (body: unknown, status = 200) => ({
	status,
	contentType: 'application/json',
	body: JSON.stringify(body),
});

const storedFor = (html: unknown) =>
	Object.values(DESCRIPTIONS as Record<string, DescriptionCase>).find((c) => c.html === html)?.stored ??
	`UNMAPPED HTML: ${String(html)}`;

/**
 * Signed-in instructor and a lessons API that keeps what the backend would
 * store. Every other request leaving the page is aborted.
 */
async function stubBackend(page: Page, baseURL: string | undefined, description: string) {
	const lesson = {
		_id: LESSON_ID,
		moduleId: 'm1',
		courseId: 'c1',
		title: TITLE,
		url: VIDEO_URL,
		duration: '9:22',
		lessonIndex: 1,
		description,
	};
	const saves: Record<string, unknown>[] = [];
	const appOrigin = new URL(baseURL ?? 'http://localhost:5173').origin;

	await page.route((url) => url.origin !== appOrigin, (route) => route.abort());
	await page.route('**/api/v1/users/checkToken', (route) =>
		route.fulfill(json({ status: 'success', token: 'test-token', data: { user: INSTRUCTOR } })),
	);
	await page.route('**/api/v1/users/me', (route) => route.fulfill(json({ status: 'success', data: INSTRUCTOR })));
	await page.route(`**/api/v1/lessons/${LESSON_ID}`, (route) => {
		const request = route.request();
		if (request.method() === 'GET') return route.fulfill(json({ status: 'success', data: lesson }));
		if (request.method() !== 'PATCH') return route.abort();
		const body = request.postDataJSON() as Record<string, unknown>;
		saves.push(body);
		const { description: html, ...fields } = body;
		Object.assign(lesson, fields, html === undefined ? {} : { description: storedFor(html) });
		return route.fulfill(json({ status: 'success', data: lesson }));
	});
	await page.addInitScript((user) => {
		localStorage.setItem('profile', JSON.stringify({ token: 'test-token', user }));
	}, INSTRUCTOR);
	return { lesson, saves };
}

const editor = (page: Page) => page.locator('.ProseMirror');
const blocks = (page: Page, selector: string) => editor(page).locator(`:scope > ${selector}`);

/** Opens (or reopens) the lesson and waits until the stored lesson is loaded. */
async function open(page: Page) {
	await page.goto(`/instructor/lessons/${LESSON_ID}/edit`);
	// Loading the lesson waits on the dev server's lazy route chunk; allow for a slow first load.
	await expect(page.getByText('Saved', { exact: true })).toBeVisible({ timeout: 15_000 });
	await expect(page.getByPlaceholder('Untitled lesson')).toHaveValue(TITLE);
}

/** Clicks Save and returns the request body. */
async function save(page: Page) {
	const response = page.waitForResponse((r) => r.request().method() === 'PATCH' && r.url().includes(LESSON_ID));
	await page.getByRole('button', { name: 'Save lesson' }).click();
	const body = (await response).request().postDataJSON() as Record<string, unknown>;
	await expect(page.getByText('Saved', { exact: true })).toBeVisible();
	return body;
}

/** Saves without editing: the builder sends the fixture HTML, so the same text is stored. */
async function expectUnchangedSave(page: Page, backend: Awaited<ReturnType<typeof stubBackend>>, fixture: DescriptionCase) {
	const body = await save(page);
	expect(body.description).toBe(fixture.html);
	expect(body.title).toBe(TITLE);
	expect(backend.lesson.description).toBe(fixture.stored);
}

test.describe('Lesson Builder plain-text descriptions', () => {
	test('1. a two-paragraph description loads as two paragraphs', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.paragraphs.stored);
		await open(page);
		await expect(blocks(page, 'p')).toHaveText(['Inspect the scaffold before every shift.', 'Record defects in the site log.']);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.paragraphs);
	});

	test('2. headings and paragraphs load as separate blocks', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.headings.stored);
		await open(page);
		await expect(blocks(page, 'p')).toHaveText([
			'Fall protection',
			'Guardrails are the first line of defence.',
			'Harnesses',
			'Check the webbing for cuts before use.',
		]);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.headings);
	});

	test('3. unordered list items load on separate lines', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.bulletList.stored);
		await open(page);
		await expect(blocks(page, 'p')).toHaveCount(2);
		const items = blocks(page, 'p').nth(1);
		await expect(items.locator('br')).toHaveCount(2);
		expect(await items.innerText()).toBe('Base plates\nGuardrails\nToe boards');
		await expectUnchangedSave(page, backend, DESCRIPTIONS.bulletList);
	});

	test('4. ordered lists load as numbered lists, keeping their numbers', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.orderedList.stored);
		await open(page);
		const lists = blocks(page, 'ol');
		await expect(lists).toHaveCount(2);
		await expect(lists.nth(0).locator('li')).toHaveText(['Inspect the ladder', 'Secure the top', 'Keep three points of contact']);
		await expect(lists.nth(0)).not.toHaveAttribute('start', /.*/);
		await expect(lists.nth(1).locator('li')).toHaveText(['Lower the tools', 'Sign the permit']);
		await expect(lists.nth(1)).toHaveAttribute('start', '4');
		await expectUnchangedSave(page, backend, DESCRIPTIONS.orderedList);
	});

	test('5. text saved from inline formatting loads as readable text', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.inline.stored);
		await open(page);
		await expect(blocks(page, 'p')).toHaveText([DESCRIPTIONS.inline.stored]);
		await expect(editor(page).locator('strong, em, code, a')).toHaveCount(0);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.inline);
	});

	test('6–9. Vec<T>, Map<K, V>, x < y, x > y and A & B load literally', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.notation.stored);
		await open(page);
		await expect(blocks(page, 'p')).toHaveText([
			'Generics: Vec<T> and Map<K, V>.',
			'Compare x < y and x > y.',
			'A & B, written &amp; in HTML.',
		]);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.notation);
	});

	test('10. Unicode, emoji and punctuation load unchanged', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.unicode.stored);
		await open(page);
		await expect(blocks(page, 'p')).toHaveText([DESCRIPTIONS.unicode.stored]);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.unicode);

		backend.lesson.description = PUNCTUATION;
		await open(page);
		await expect(blocks(page, 'p')).toHaveText([PUNCTUATION]);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.punctuation);
	});

	test('indented code keeps its whitespace', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.code.stored);
		await open(page);
		const code = blocks(page, 'pre');
		await expect(code).toHaveClass(CODE_BLOCK_CLASS);
		expect(await code.textContent()).toBe('  if (load > limit) {\n    stop();\n  }');
		await expectUnchangedSave(page, backend, DESCRIPTIONS.code);
	});

	test('11. saving without editing stores the exact same text', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.mixed.stored);
		await open(page);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.mixed);
		expect(backend.saves).toHaveLength(1);
	});

	test('12. editing one paragraph leaves the others intact', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.notation.stored);
		await open(page);
		await blocks(page, 'p').nth(1).click();
		await page.keyboard.press('End');
		await page.keyboard.type(' Always.');
		await expect(page.getByText('Unsaved changes', { exact: true })).toBeVisible();

		const body = await save(page);
		expect(body.description).toBe(DESCRIPTIONS.notationEdited.html);
		expect(body.title).toBe(TITLE);
		expect(backend.lesson.description).toBe(DESCRIPTIONS.notationEdited.stored);
	});

	test('13. reopening an edited lesson shows the edit', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.notation.stored);
		await open(page);
		await blocks(page, 'p').nth(1).click();
		await page.keyboard.press('End');
		await page.keyboard.type(' Always.');
		await save(page);

		await open(page);
		await expect(blocks(page, 'p')).toHaveText([
			'Generics: Vec<T> and Map<K, V>.',
			'Compare x < y and x > y. Always.',
			'A & B, written &amp; in HTML.',
		]);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.notationEdited);
	});

	test('14. repeated open/save cycles do not change the content', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.mixed.stored);
		for (let cycle = 0; cycle < 3; cycle++) {
			await open(page);
			await expectUnchangedSave(page, backend, DESCRIPTIONS.mixed);
			// The offline draft cache holds editor HTML, which also reloads cleanly.
			await expect
				.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}').html, DRAFT_KEY))
				.toBe(DESCRIPTIONS.mixed.html);
		}
		expect(backend.saves).toHaveLength(3);
	});

	test('15. markup in a description is shown as text and never runs', async ({ page, baseURL }) => {
		const dialogs: string[] = [];
		page.on('dialog', (dialog) => {
			dialogs.push(dialog.message());
			void dialog.dismiss();
		});
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.markupAsText.stored);
		await open(page);
		await expect(blocks(page, 'p')).toHaveText([
			'<script>window.__pwned = 1</script>',
			'<img src=x onerror="window.__pwned = 1"> and <a href="javascript:window.__pwned = 1">a link</a>',
		]);
		await expect(editor(page).locator('script, img, a')).toHaveCount(0);
		await expectUnchangedSave(page, backend, DESCRIPTIONS.markupAsText);
		expect(await page.evaluate(() => (window as Window & { __pwned?: number }).__pwned)).toBeUndefined();
		expect(dialogs).toEqual([]);
	});

	test('16. the lesson title is shown and saved exactly as stored', async ({ page, baseURL }) => {
		const backend = await stubBackend(page, baseURL, DESCRIPTIONS.paragraphs.stored);
		await open(page);
		await blocks(page, 'p').nth(0).click();
		await page.keyboard.press('End');
		await page.keyboard.type('!');
		const body = await save(page);
		expect(body.title).toBe(TITLE);
		expect(backend.lesson.title).toBe(TITLE);
	});
});
