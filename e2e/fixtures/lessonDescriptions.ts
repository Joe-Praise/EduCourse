/**
 * Lesson descriptions as the backend stores them (plain text), paired with the
 * HTML the Lesson Builder must send when it saves them unchanged.
 *
 * The backend's lesson sanitizer turns each `html` back into its `stored` text;
 * the backend repository asserts the same pairs
 * (`tests/unit/plainText.test.ts`, "Lesson Builder round trip"). Together the
 * two suites cover stored text → editor → save → identical stored text.
 */

export interface DescriptionCase {
	stored: string;
	html: string;
}

/** `codeBlock` HTMLAttributes configured in LessonBuilder. */
export const CODE_BLOCK_CLASS = 'rounded-card bg-bg-sunken px-4 py-3 font-mono text-sm text-ink-primary';

/**
 * TipTap keeps an empty paragraph after a final list or code block so there is
 * somewhere to type; the backend drops it.
 */
const TRAILING_PARAGRAPH = '<p></p>';

export const PUNCTUATION = `Really?! (Yes): 50% off; [x] {y} #tag @site ~ ^ * _ | \\ / \` ' " ... -- end.`;

export const DESCRIPTIONS = {
	paragraphs: {
		stored: 'Inspect the scaffold before every shift.\n\nRecord defects in the site log.',
		html: '<p>Inspect the scaffold before every shift.</p><p>Record defects in the site log.</p>',
	},
	headings: {
		stored:
			'Fall protection\n\nGuardrails are the first line of defence.\n\nHarnesses\n\nCheck the webbing for cuts before use.',
		html:
			'<p>Fall protection</p><p>Guardrails are the first line of defence.</p>' +
			'<p>Harnesses</p><p>Check the webbing for cuts before use.</p>',
	},
	bulletList: {
		stored: 'Check these:\n\nBase plates\nGuardrails\nToe boards',
		html: '<p>Check these:</p><p>Base plates<br>Guardrails<br>Toe boards</p>',
	},
	orderedList: {
		stored:
			'Before climbing:\n\n1. Inspect the ladder\n2. Secure the top\n3. Keep three points of contact\n\n' +
			'After the job:\n\n4. Lower the tools\n5. Sign the permit',
		html:
			'<p>Before climbing:</p><ol><li><p>Inspect the ladder</p></li><li><p>Secure the top</p></li>' +
			'<li><p>Keep three points of contact</p></li></ol><p>After the job:</p>' +
			'<ol start="4"><li><p>Lower the tools</p></li><li><p>Sign the permit</p></li></ol>' +
			TRAILING_PARAGRAPH,
	},
	inline: {
		// Saved from `Wear a <strong>hard hat</strong> in every zone marked <em>Danger</em> (code <code>PPE-01</code>); see <a href="…">the site rules</a>.`
		stored: 'Wear a hard hat in every zone marked Danger (code PPE-01); see the site rules.',
		html: '<p>Wear a hard hat in every zone marked Danger (code PPE-01); see the site rules.</p>',
	},
	notation: {
		stored: 'Generics: Vec<T> and Map<K, V>.\n\nCompare x < y and x > y.\n\nA & B, written &amp; in HTML.',
		html:
			'<p>Generics: Vec&lt;T&gt; and Map&lt;K, V&gt;.</p><p>Compare x &lt; y and x &gt; y.</p>' +
			'<p>A &amp; B, written &amp;amp; in HTML.</p>',
	},
	notationEdited: {
		stored: 'Generics: Vec<T> and Map<K, V>.\n\nCompare x < y and x > y. Always.\n\nA & B, written &amp; in HTML.',
		html:
			'<p>Generics: Vec&lt;T&gt; and Map&lt;K, V&gt;.</p><p>Compare x &lt; y and x &gt; y. Always.</p>' +
			'<p>A &amp; B, written &amp;amp; in HTML.</p>',
	},
	unicode: {
		stored: 'Café, naïve façade — “quoted” ✓ 🚧 日本語 ½ 21 °C',
		html: '<p>Café, naïve façade — “quoted” ✓ 🚧 日本語 ½ 21 °C</p>',
	},
	punctuation: {
		stored: PUNCTUATION,
		html: `<p>${PUNCTUATION}</p>`,
	},
	code: {
		stored: 'Load check:\n\n  if (load > limit) {\n    stop();\n  }',
		html: `<p>Load check:</p><pre class="${CODE_BLOCK_CLASS}"><code>  if (load &gt; limit) {\n    stop();\n  }</code></pre>${TRAILING_PARAGRAPH}`,
	},
	markupAsText: {
		stored:
			'<script>window.__pwned = 1</script>\n\n' +
			'<img src=x onerror="window.__pwned = 1"> and <a href="javascript:window.__pwned = 1">a link</a>',
		html:
			'<p>&lt;script&gt;window.__pwned = 1&lt;/script&gt;</p>' +
			'<p>&lt;img src=x onerror="window.__pwned = 1"&gt; and &lt;a href="javascript:window.__pwned = 1"&gt;a link&lt;/a&gt;</p>',
	},
	mixed: {
		stored:
			'Site induction\n\nEvery worker signs in & reads the plan.\n\n1. Check Map<Zone, Risk>\n2. Confirm x < limit\n\n' +
			'Hard hat\nHi-vis vest\n\nTemperature: 21 °C ✓ 🚧\n\n  report(zone, "ok");',
		html:
			'<p>Site induction</p><p>Every worker signs in &amp; reads the plan.</p>' +
			'<ol><li><p>Check Map&lt;Zone, Risk&gt;</p></li><li><p>Confirm x &lt; limit</p></li></ol>' +
			'<p>Hard hat<br>Hi-vis vest</p><p>Temperature: 21 °C ✓ 🚧</p>' +
			`<pre class="${CODE_BLOCK_CLASS}"><code>  report(zone, "ok");</code></pre>${TRAILING_PARAGRAPH}`,
	},
} satisfies Record<string, DescriptionCase>;
