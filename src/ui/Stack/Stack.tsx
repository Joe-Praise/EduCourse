import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
type Align = 'start' | 'center' | 'end' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
	gap?: Gap;
	align?: Align;
	justify?: Justify;
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
	10: 'gap-10',
	12: 'gap-12',
};

const alignClass: Record<Align, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
};

const justifyClass: Record<Justify, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
	({ gap = 4, align = 'stretch', justify = 'start', className, children, ...rest }, ref) => (
		<div
			ref={ref}
			className={cn('flex flex-col', gapClass[gap], alignClass[align], justifyClass[justify], className)}
			{...rest}
		>
			{children}
		</div>
	),
);
Stack.displayName = 'Stack';
