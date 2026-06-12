import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	'aria-label': string;
	variant?: IconButtonVariant;
	size?: IconButtonSize;
	active?: boolean;
	children: ReactNode;
}

const variantClass: Record<IconButtonVariant, string> = {
	primary: 'bg-brand-500 text-white hover:bg-brand-600',
	secondary: 'bg-bg-overlay/70 text-ink-secondary border border-line-base hover:text-ink-primary hover:border-line-strong',
	ghost: 'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay',
};

const sizeClass: Record<IconButtonSize, string> = {
	sm: 'h-8 w-8',
	md: 'h-10 w-10',
	lg: 'h-12 w-12',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			variant = 'secondary',
			size = 'md',
			active,
			className,
			children,
			type = 'button',
			...rest
		},
		ref,
	) => (
		<button
			ref={ref}
			type={type}
			aria-pressed={active !== undefined ? active : undefined}
			className={cn(
				'inline-grid place-items-center rounded-full',
				'transition-[transform,background,color,border-color] duration-base ease-out-quart',
				'active:scale-95 focus-visible:outline-none focus-visible:shadow-focus-ring',
				'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
				'motion-reduce:transition-none motion-reduce:active:scale-100',
				variantClass[variant],
				sizeClass[size],
				active && 'text-brand-400',
				className,
			)}
			{...rest}
		>
			{children}
		</button>
	),
);
IconButton.displayName = 'IconButton';
