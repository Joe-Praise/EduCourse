import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface ReadingProgressProps {
	targetId?: string;
	className?: string;
}

export const ReadingProgress = ({ targetId, className }: ReadingProgressProps) => {
	const barRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<ScrollTrigger | null>(null);

	useGSAP(
		() => {
			if (!barRef.current) return;
			const trigger = targetId ? document.getElementById(targetId) : document.body;
			if (!trigger) return;
			triggerRef.current = ScrollTrigger.create({
				trigger,
				start: 'top top',
				end: 'bottom bottom',
				scrub: true,
				onUpdate: (self) => {
					gsap.set(barRef.current, { scaleX: self.progress });
				},
			});
			return () => {
				triggerRef.current?.kill();
			};
		},
		{ dependencies: [targetId] },
	);

	useEffect(() => {
		return () => {
			triggerRef.current?.kill();
		};
	}, []);

	return (
		<div
			aria-hidden
			className={cn('fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none', className)}
		>
			<div
				ref={barRef}
				className='h-full bg-gradient-to-r from-brand-500 to-brand-400 origin-left'
				style={{ transform: 'scaleX(0)' }}
			/>
		</div>
	);
};
