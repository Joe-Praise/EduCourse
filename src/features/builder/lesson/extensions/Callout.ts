import { Node, mergeAttributes } from '@tiptap/core';

type CalloutTone = 'info' | 'success' | 'warning' | 'danger';

export interface CalloutOptions {
	HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		callout: {
			setCallout: (tone: CalloutTone) => ReturnType;
			toggleCallout: (tone: CalloutTone) => ReturnType;
			unsetCallout: () => ReturnType;
		};
	}
}

const TONE_CLASS: Record<CalloutTone, string> = {
	info: 'border-signal-info/40 bg-signal-info/10 text-ink-primary',
	success: 'border-signal-success/40 bg-signal-success/10 text-ink-primary',
	warning: 'border-sienna-500/40 bg-sienna-500/10 text-ink-primary',
	danger: 'border-signal-danger/40 bg-signal-danger/10 text-ink-primary',
};

export const Callout = Node.create<CalloutOptions>({
	name: 'callout',
	group: 'block',
	content: 'block+',
	defining: true,

	addOptions() {
		return { HTMLAttributes: {} };
	},

	addAttributes() {
		return {
			tone: {
				default: 'info',
				parseHTML: (el) => el.getAttribute('data-tone') ?? 'info',
				renderHTML: (attrs) => ({ 'data-tone': attrs.tone }),
			},
		};
	},

	parseHTML() {
		return [{ tag: 'div[data-callout]' }];
	},

	renderHTML({ HTMLAttributes, node }) {
		const tone = (node.attrs.tone as CalloutTone) ?? 'info';
		return [
			'div',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-callout': 'true',
				class: `my-4 rounded-card border-l-4 px-5 py-4 font-body ${TONE_CLASS[tone]}`,
			}),
			0,
		];
	},

	addCommands() {
		return {
			setCallout:
				(tone) =>
				({ commands }) =>
					commands.wrapIn(this.name, { tone }),
			toggleCallout:
				(tone) =>
				({ commands }) =>
					commands.toggleWrap(this.name, { tone }),
			unsetCallout:
				() =>
				({ commands }) =>
					commands.lift(this.name),
		};
	},
});
