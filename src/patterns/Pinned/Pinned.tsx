import { useRef, useState, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger, prefersReducedMotion } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface PinnedProps {
	className?: string;
	pinSpacing?: boolean;
	children: ((args: { progress: number }) => ReactNode) | ReactNode;
}

/**
 * Pins a section while scrolling through it. Children may be a render
 * function receiving `progress` (0–1) for scrub-driven choreography.
 */
export const Pinned = ({ className, pinSpacing = true, children }: PinnedProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState<number>(0);

	useGSAP(
		() => {
			if (!ref.current) return;
			if (prefersReducedMotion()) return;
			const trigger = ScrollTrigger.create({
				trigger: ref.current,
				start: 'top top',
				end: '+=100%',
				pin: true,
				pinSpacing,
				scrub: true,
				onUpdate: (self) => setProgress(self.progress),
			});
			return () => trigger.kill();
		},
		{ scope: ref, dependencies: [pinSpacing] },
	);

	return (
		<div ref={ref} className={cn('relative min-h-screen', className)}>
			{typeof children === 'function' ? children({ progress }) : children}
		</div>
	);
};
