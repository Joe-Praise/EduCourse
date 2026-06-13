import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { gsap } from '../../lib/motion';
import { cn } from '../../lib/cn';

export interface TabItem<TValue extends string = string> {
	value: TValue;
	label: ReactNode;
	disabled?: boolean;
}

interface TabsProps<TValue extends string = string>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	items: ReadonlyArray<TabItem<TValue>>;
	value: TValue;
	onChange: (next: TValue) => void;
	size?: 'sm' | 'md';
	'aria-label': string;
}

const triggerSizeClass = {
	sm: 'h-9 px-3 text-sm',
	md: 'h-11 px-4 text-sm',
} as const;

interface IndicatorRect {
	left: number;
	width: number;
}

export function Tabs<TValue extends string = string>({
	items,
	value,
	onChange,
	size = 'md',
	className,
	'aria-label': ariaLabel,
	...rest
}: TabsProps<TValue>) {
	const listRef = useRef<HTMLDivElement | null>(null);
	const indicatorRef = useRef<HTMLSpanElement | null>(null);
	const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
	const prevRectRef = useRef<IndicatorRect | null>(null);
	const [indicatorRect, setIndicatorRect] = useState<IndicatorRect | null>(null);

	const setButtonRef = (key: string) => (node: HTMLButtonElement | null) => {
		const map = buttonsRef.current;
		if (node) map.set(key, node);
		else map.delete(key);
	};

	const measure = () => {
		const list = listRef.current;
		const btn = buttonsRef.current.get(value);
		if (!list || !btn) return null;
		const listRect = list.getBoundingClientRect();
		const btnRect = btn.getBoundingClientRect();
		return { left: btnRect.left - listRect.left, width: btnRect.width };
	};

	useLayoutEffect(() => {
		const next = measure();
		if (!next) return;
		setIndicatorRect(next);
	}, [value, items.length]);

	useEffect(() => {
		if (!indicatorRect || !indicatorRef.current) return;
		const prev = prevRectRef.current;
		const el = indicatorRef.current;
		if (prev) {
			const dx = prev.left - indicatorRect.left;
			const sx = prev.width / Math.max(indicatorRect.width, 1);
			gsap.fromTo(
				el,
				{ x: dx, scaleX: sx, transformOrigin: 'left center' },
				{ x: 0, scaleX: 1, duration: 0.24, ease: 'power3.out' },
			);
		}
		prevRectRef.current = indicatorRect;
	}, [indicatorRect]);

	useEffect(() => {
		const onResize = () => {
			const next = measure();
			if (next) setIndicatorRect(next);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [value]);

	return (
		<div
			ref={listRef}
			role='tablist'
			aria-label={ariaLabel}
			className={cn(
				'relative flex items-center gap-1 border-b border-line-base',
				className,
			)}
			{...rest}
		>
			{items.map((item) => {
				const active = item.value === value;
				return (
					<button
						key={item.value}
						ref={setButtonRef(item.value)}
						type='button'
						role='tab'
						aria-selected={active}
						disabled={item.disabled}
						onClick={() => onChange(item.value)}
						className={cn(
							'relative inline-flex items-center justify-center font-body font-medium',
							'transition-colors duration-base ease-out-quart',
							'focus-visible:outline-none focus-visible:shadow-focus-ring rounded-sm',
							'disabled:opacity-40 disabled:cursor-not-allowed',
							triggerSizeClass[size],
							active ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
						)}
					>
						{item.label}
					</button>
				);
			})}
			{indicatorRect && (
				<span
					ref={indicatorRef}
					aria-hidden
					className='absolute -bottom-px h-0.5 bg-brand-500 rounded-full pointer-events-none'
					style={{
						left: `${indicatorRect.left}px`,
						width: `${indicatorRect.width}px`,
					}}
				/>
			)}
		</div>
	);
}
