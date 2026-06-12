import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/motion';

interface PageTransitionProps {
	transitionKey: string;
	children: ReactNode;
}

export const PageTransition = ({ transitionKey, children }: PageTransitionProps) => {
	const ref = useRef<HTMLDivElement | null>(null);

	useGSAP(
		() => {
			if (!ref.current) return;
			gsap.from(ref.current, {
				opacity: 0,
				y: 8,
				duration: 0.24,
				ease: 'power3.out',
			});
		},
		{ scope: ref, dependencies: [transitionKey] },
	);

	return (
		<div ref={ref} key={transitionKey}>
			{children}
		</div>
	);
};
