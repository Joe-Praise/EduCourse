import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ChipProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
	selected?: boolean;
	removable?: boolean;
	iconLeading?: ReactNode;
	onSelect?: MouseEventHandler<HTMLButtonElement>;
	onRemove?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	children: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
	(
		{
			selected = false,
			removable = false,
			iconLeading,
			onSelect,
			onRemove,
			disabled,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const handleRemove: MouseEventHandler<HTMLButtonElement> = (event) => {
			event.stopPropagation();
			onRemove?.(event);
		};

		return (
			<button
				ref={ref}
				type='button'
				role='option'
				aria-selected={selected}
				disabled={disabled}
				onClick={onSelect}
				className={cn(
					'inline-flex items-center gap-2 rounded-pill px-3 h-8 font-body text-xs font-medium',
					'transition-[background,border-color,color] duration-base ease-out-quart',
					'focus-visible:outline-none focus-visible:shadow-focus-ring',
					'disabled:opacity-40 disabled:cursor-not-allowed',
					selected
						? 'bg-brand-500/15 text-brand-400 border border-brand-500/40'
						: 'bg-bg-overlay text-ink-secondary border border-line-base hover:text-ink-primary hover:border-line-strong',
					className,
				)}
				{...rest}
			>
				{iconLeading && <span className='shrink-0 -ml-0.5'>{iconLeading}</span>}
				<span>{children}</span>
				{removable && (
					<span
						role='button'
						tabIndex={-1}
						aria-label='Remove'
						onClick={handleRemove}
						className='-mr-1 grid h-4 w-4 place-items-center rounded-full hover:bg-line-strong cursor-pointer'
					>
						<X size={11} strokeWidth={2.5} />
					</span>
				)}
			</button>
		);
	},
);
Chip.displayName = 'Chip';
