import { type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type TextVariant =
	| 'display-xl'
	| 'display-lg'
	| 'display-md'
	| 'display-sm'
	| 'body-lg'
	| 'body'
	| 'body-sm'
	| 'body-xs'
	| 'body-2xs'
	| 'mono';

export type TextTone =
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'muted'
	| 'brand'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'inherit';

type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';

interface TextProps extends HTMLAttributes<HTMLElement> {
	as?: TextElement;
	variant?: TextVariant;
	tone?: TextTone;
	truncate?: boolean;
	clamp?: 1 | 2 | 3 | 4;
	children: ReactNode;
}

const variantClass: Record<TextVariant, string> = {
	'display-xl': 'font-display text-6xl font-semibold leading-[1.05] tracking-[-0.03em]',
	'display-lg': 'font-display text-5xl font-semibold leading-[1.1] tracking-[-0.025em]',
	'display-md': 'font-display text-4xl font-semibold leading-[1.15] tracking-[-0.02em]',
	'display-sm': 'font-display text-2xl font-semibold leading-[1.2] tracking-[-0.015em]',
	'body-lg': 'font-body text-lg font-normal leading-[1.55]',
	body: 'font-body text-base font-normal leading-[1.6]',
	'body-sm': 'font-body text-sm font-normal leading-[1.55]',
	'body-xs': 'font-body text-xs font-normal leading-[1.5]',
	'body-2xs': 'font-body text-2xs font-medium leading-[1.4]',
	mono: 'font-mono text-xs font-medium uppercase tracking-[0.12em]',
};

const toneClass: Record<TextTone, string> = {
	primary: 'text-ink-primary',
	secondary: 'text-ink-secondary',
	tertiary: 'text-ink-tertiary',
	muted: 'text-ink-muted',
	brand: 'text-brand-400',
	success: 'text-signal-success',
	warning: 'text-signal-warning',
	danger: 'text-signal-danger',
	info: 'text-signal-info',
	inherit: '',
};

const clampClass: Record<NonNullable<TextProps['clamp']>, string> = {
	1: 'line-clamp-1',
	2: 'line-clamp-2',
	3: 'line-clamp-3',
	4: 'line-clamp-4',
};

export const Text = ({
	as = 'p',
	variant = 'body',
	tone = 'primary',
	truncate,
	clamp,
	className,
	children,
	...rest
}: TextProps) => {
	const Element = as as ElementType;
	return (
		<Element
			className={cn(
				variantClass[variant],
				toneClass[tone],
				truncate && 'truncate',
				clamp && clampClass[clamp],
				className,
			)}
			{...rest}
		>
			{children}
		</Element>
	);
};
