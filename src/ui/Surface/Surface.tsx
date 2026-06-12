import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type SurfaceLevel = 'base' | 'raised' | 'sunken' | 'overlay';

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
	level?: SurfaceLevel;
	interactive?: boolean;
	glow?: boolean;
	children: ReactNode;
}

const levelClass: Record<SurfaceLevel, string> = {
	base: 'bg-bg-base',
	raised: 'bg-bg-raised',
	sunken: 'bg-bg-sunken',
	overlay: 'bg-bg-overlay',
};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
	({ level = 'raised', interactive, glow, className, children, ...rest }, ref) => (
		<div
			ref={ref}
			className={cn(
				'relative rounded-card shadow-elev-1',
				levelClass[level],
				interactive && [
					'transition-[transform,box-shadow,border-color] duration-base ease-out-quart',
					'hover:-translate-y-0.5 hover:shadow-elev-2 cursor-pointer',
					'motion-reduce:transition-none motion-reduce:transform-none',
				],
				glow && 'shadow-elev-glow',
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	),
);
Surface.displayName = 'Surface';
