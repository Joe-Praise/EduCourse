import { useRef, useCallback, type MouseEventHandler } from 'react';
import { useGSAP } from '@gsap/react';
import { Heart } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface WishlistToggleProps {
	active: boolean;
	onToggle: () => void;
	label?: string;
	size?: 'sm' | 'md';
	hideUntilHover?: boolean;
	className?: string;
}

const sizeClass = {
	sm: { box: 'h-8 w-8', icon: 14 },
	md: { box: 'h-9 w-9', icon: 16 },
} as const;

export function WishlistToggle({
	active,
	onToggle,
	label,
	size = 'md',
	hideUntilHover = false,
	className,
}: WishlistToggleProps) {
	const rootRef = useRef<HTMLButtonElement | null>(null);
	const firstRender = useRef<boolean>(true);
	const dims = sizeClass[size];

	useGSAP(
		() => {
			if (firstRender.current) {
				firstRender.current = false;
				return;
			}
			if (!active) return;
			gsap.fromTo(
				'.wishlist-icon',
				{ scale: 0.7 },
				{ scale: 1, duration: 0.24, ease: 'back.out(2)' },
			);
			gsap.fromTo(
				'.wishlist-ring',
				{ scale: 0.6, opacity: 0.55 },
				{ scale: 1.8, opacity: 0, duration: 0.5, ease: 'power3.out' },
			);
		},
		{ scope: rootRef, dependencies: [active] },
	);

	const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
		(event) => {
			event.preventDefault();
			event.stopPropagation();
			onToggle();
		},
		[onToggle],
	);

	return (
		<button
			ref={rootRef}
			type='button'
			onClick={handleClick}
			aria-pressed={active}
			aria-label={
				active ? `Remove ${label ?? 'course'} from wishlist` : `Add ${label ?? 'course'} to wishlist`
			}
			className={cn(
				'relative grid place-items-center rounded-full',
				'bg-bg-overlay/75 border border-line-base text-ink-secondary',
				'backdrop-blur-md',
				'transition-[opacity,transform,color,border-color] duration-base ease-out-quart',
				'hover:text-ink-primary hover:border-line-strong active:scale-95',
				'focus-visible:outline-none focus-visible:shadow-focus-ring',
				'motion-reduce:transition-none motion-reduce:active:scale-100',
				dims.box,
				hideUntilHover && !active
					? 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
					: 'opacity-100',
				active && 'text-brand-400 border-brand-500/40',
				className,
			)}
		>
			<span className='wishlist-icon inline-flex'>
				<Heart
					size={dims.icon}
					strokeWidth={1.75}
					className={cn(active && 'fill-current')}
				/>
			</span>
			{active && (
				<span
					aria-hidden
					className='wishlist-ring pointer-events-none absolute inset-0 rounded-full ring-2 ring-brand-500'
				/>
			)}
		</button>
	);
}
