import { useRef, type ElementType, type ReactNode } from 'react';
import { useReveal, type RevealMode } from '../../lib/useReveal';

interface RevealProps {
	mode?: RevealMode;
	as?: ElementType;
	start?: string;
	stagger?: number;
	delay?: number;
	once?: boolean;
	className?: string;
	children: ReactNode;
}

export const Reveal = ({
	mode = 'fade-up',
	as,
	start,
	stagger,
	delay,
	once,
	className,
	children,
}: RevealProps) => {
	const ref = useRef<HTMLDivElement>(null);
	useReveal(ref, { mode, start, stagger, delay, once });
	const Element = (as ?? 'div') as ElementType;
	return (
		<Element ref={ref} className={className}>
			{children}
		</Element>
	);
};
