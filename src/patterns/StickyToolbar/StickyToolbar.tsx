import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface StickyToolbarProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	offsetTop?: number;
}

export const StickyToolbar = ({
	children,
	offsetTop = 0,
	className,
	style,
	...rest
}: StickyToolbarProps) => (
	<div
		className={cn(
			'sticky z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3',
			'bg-bg-base/85 backdrop-blur-md border-b border-line-subtle',
			className,
		)}
		style={{ top: offsetTop, ...style }}
		{...rest}
	>
		{children}
	</div>
);
