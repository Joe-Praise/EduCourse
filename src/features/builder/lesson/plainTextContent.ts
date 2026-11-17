import type { JSONContent } from '@tiptap/core';

/**
 * Lesson descriptions are stored as plain text: the builder saves TipTap HTML
 * and the backend keeps only its readable text. Blocks (paragraphs, headings,
 * lists) are separated by a blank line, list items and line breaks by a single
 * newline, and ordered items keep their "N. " numbers.
 *
 * `plainTextToDoc` turns that text back into an editor document without ever
 * parsing it as HTML, so `Vec<T>`, `A & B` or a literal `<script>` stay text.
 * Saving the document unchanged produces the same plain text again.
 */

/**
 * Whitespace that HTML collapses: anything but a single space between words.
 * Lines containing it come from code blocks and are loaded as one.
 */
const UNSTABLE_SPACE = /[^\S ]|^ | $| {2}/;
const NUMBERED = /^(\d+)\. (.+)$/;

const text = (value: string): JSONContent => ({ type: 'text', text: value });

const paragraph = (lines: string[]): JSONContent => ({
	type: 'paragraph',
	content: lines.flatMap((line, i) => (i === 0 ? [text(line)] : [{ type: 'hardBreak' }, text(line)])),
});

/** Lines numbered "n. ", "n+1. ", …; `null` if the block is not such a list. */
function orderedItems(lines: string[]): { start: number; items: string[] } | null {
	if (lines.length < 2) return null;
	const items: string[] = [];
	let start = 0;
	for (let i = 0; i < lines.length; i++) {
		const match = NUMBERED.exec(lines[i]);
		if (!match) return null;
		const n = Number(match[1]);
		// "07." would be saved back as "7.".
		if (!Number.isSafeInteger(n) || String(n) !== match[1]) return null;
		if (i === 0) start = n;
		else if (n !== start + i) return null;
		items.push(match[2]);
	}
	return { start, items };
}

function toBlock(block: string, verbatim: boolean): JSONContent {
	const lines = block.split('\n');
	if (verbatim || lines.some((line) => UNSTABLE_SPACE.test(line))) {
		return { type: 'codeBlock', content: [text(block)] };
	}
	const list = orderedItems(lines);
	if (list) {
		return {
			type: 'orderedList',
			attrs: { start: list.start },
			content: list.items.map((item) => ({ type: 'listItem', content: [paragraph([item])] })),
		};
	}
	// Unnumbered lines (bullet items, line breaks) carry no list marker in the
	// stored text, so they come back as lines of one paragraph.
	return paragraph(lines);
}

export function plainTextToDoc(value: string): JSONContent {
	const content: JSONContent[] = [];
	const parts = value.split(/(\n{2,})/);
	let block = parts[0];
	let verbatim = false;
	const flush = () => {
		if (block) content.push(toBlock(block, verbatim));
	};
	for (let i = 1; i < parts.length; i += 2) {
		// Two or more blank lines in a row, or trailing spaces before one, only
		// occur inside a code block, which keeps the text around them together.
		if (parts[i].length > 2 || /[ \t]$/.test(block)) {
			block += parts[i] + parts[i + 1];
			verbatim = true;
		} else {
			flush();
			block = parts[i + 1];
			verbatim = false;
		}
	}
	flush();
	return { type: 'doc', content: content.length > 0 ? content : [{ type: 'paragraph' }] };
}
