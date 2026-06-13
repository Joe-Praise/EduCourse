import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glow' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	iconLeading?: ReactNode;
	iconTrailing?: ReactNode;
	fullWidth?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
	primary:
		'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-600 disabled:bg-brand-500/40 disabled:text-white/60',
	secondary:
		'bg-bg-overlay text-ink-primary border border-line-base hover:border-line-strong hover:bg-bg-raised disabled:opacity-50',
	ghost:
		'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay disabled:opacity-40',
	glow:
		'bg-brand-500 text-white shadow-elev-glow hover:bg-brand-600 disabled:bg-brand-500/40 disabled:shadow-none',
	danger:
		'bg-signal-danger text-white hover:bg-signal-danger/90 disabled:opacity-50',
};

const sizeClass: Record<ButtonSize, string> = {
	sm: 'h-8 px-3 text-xs gap-1.5',
	md: 'h-10 px-4 text-sm gap-2',
	lg: 'h-12 px-6 text-base gap-2',
};

const Spinner = ({ size }: { size: ButtonSize }) => (
	<span
		aria-hidden
		className={cn(
			'inline-block animate-spin rounded-full border-2 border-current border-r-transparent',
			size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5',
		)}
	/>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			loading = false,
			iconLeading,
			iconTrailing,
			fullWidth,
			disabled,
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
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			className={cn(
				'relative inline-flex items-center justify-center rounded-card font-medium font-body',
				'transition-[transform,background,box-shadow,border-color] duration-base ease-out-quart',
				'active:scale-[0.97]',
				'focus-visible:outline-none focus-visible:shadow-focus-ring',
				'disabled:cursor-not-allowed disabled:active:scale-100',
				'motion-reduce:transition-none motion-reduce:active:scale-100',
				variantClass[variant],
				sizeClass[size],
				fullWidth && 'w-full',
				className,
			)}
			{...rest}
		>
			{loading ? (
				<Spinner size={size} />
			) : (
				<>
					{iconLeading && <span className='shrink-0'>{iconLeading}</span>}
					<span>{children}</span>
					{iconTrailing && <span className='shrink-0'>{iconTrailing}</span>}
				</>
			)}
		</button>
	),
);
Button.displayName = 'Button';
