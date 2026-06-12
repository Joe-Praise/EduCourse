import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	tone?: BadgeTone;
	size?: BadgeSize;
	children: ReactNode;
}

const toneClass: Record<BadgeTone, string> = {
	neutral: 'bg-bg-overlay text-ink-secondary border-line-base',
	brand: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
	success: 'bg-signal-success/15 text-signal-success border-signal-success/30',
	warning: 'bg-signal-warning/15 text-signal-warning border-signal-warning/30',
	danger: 'bg-signal-danger/15 text-signal-danger border-signal-danger/30',
	info: 'bg-signal-info/15 text-signal-info border-signal-info/30',
};

const sizeClass: Record<BadgeSize, string> = {
	sm: 'h-5 px-1.5 text-2xs',
	md: 'h-6 px-2 text-xs',
};

export const Badge = ({
	tone = 'neutral',
	size = 'sm',
	className,
	children,
	...rest
}: BadgeProps) => (
	<span
		className={cn(
			'inline-flex items-center justify-center rounded-pill border font-body font-medium tabular-nums',
			toneClass[tone],
			sizeClass[size],
			className,
		)}
		{...rest}
	>
		{children}
	</span>
);
