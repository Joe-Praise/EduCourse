import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around';

interface InlineProps extends HTMLAttributes<HTMLDivElement> {
	gap?: Gap;
	align?: Align;
	justify?: Justify;
	wrap?: boolean;
	children: ReactNode;
}

const gapClass: Record<Gap, string> = {
	0: 'gap-0',
	1: 'gap-1',
	2: 'gap-2',
	3: 'gap-3',
	4: 'gap-4',
	5: 'gap-5',
	6: 'gap-6',
	8: 'gap-8',
};

const alignClass: Record<Align, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	baseline: 'items-baseline',
	stretch: 'items-stretch',
};

const justifyClass: Record<Justify, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
};

export const Inline = forwardRef<HTMLDivElement, InlineProps>(
	(
		{ gap = 3, align = 'center', justify = 'start', wrap = false, className, children, ...rest },
		ref,
	) => (
		<div
			ref={ref}
			className={cn(
				'flex',
				gapClass[gap],
				alignClass[align],
				justifyClass[justify],
				wrap && 'flex-wrap',
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	),
);
Inline.displayName = 'Inline';
