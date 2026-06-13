import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion';

/**
 * Custom cursor: a 4px center dot + a 28px ring that follows the cursor.
 * Ring grows to 64px on hovering any element with data-cursor="grow".
 * Hidden on touch devices via media query. Replaces native cursor only
 * on fine-pointer devices.
 */
export const CinematicCursor = () => {
	const dotRef = useRef<HTMLDivElement | null>(null);
	const ringRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

		const dot = dotRef.current;
		const ring = ringRef.current;
		if (!dot || !ring) return;

		const setDot = gsap.quickSetter(dot, 'css');
		const ringMove = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
		const ringMoveY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });

		const onMove = (e: MouseEvent) => {
			setDot({ x: e.clientX, y: e.clientY });
			ringMove(e.clientX);
			ringMoveY(e.clientY);
		};

		const setGrow = (grow: boolean) => {
			if (prefersReducedMotion()) return;
			gsap.to(ring, {
				scale: grow ? 2.4 : 1,
				borderColor: grow ? '#C8472E' : 'rgba(245,239,227,0.35)',
				duration: 0.32,
				ease: 'power3.out',
			});
		};

		const onPointerOver = (e: PointerEvent) => {
			const target = e.target as HTMLElement | null;
			if (target?.closest('[data-cursor="grow"], a, button')) setGrow(true);
		};
		const onPointerOut = (e: PointerEvent) => {
			const target = e.target as HTMLElement | null;
			if (target?.closest('[data-cursor="grow"], a, button')) setGrow(false);
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('pointerover', onPointerOver);
		window.addEventListener('pointerout', onPointerOut);
		document.documentElement.classList.add('cinematic-cursor-active');

		return () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('pointerover', onPointerOver);
			window.removeEventListener('pointerout', onPointerOut);
			document.documentElement.classList.remove('cinematic-cursor-active');
		};
	}, []);

	return (
		<>
			<div
				ref={ringRef}
				aria-hidden
				className='pointer-events-none fixed left-0 top-0 z-[70] hidden h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border [@media(hover:hover)and(pointer:fine)]:block'
				style={{
					borderColor: 'rgba(245,239,227,0.35)',
					mixBlendMode: 'difference',
				}}
			/>
			<div
				ref={dotRef}
				aria-hidden
				className='pointer-events-none fixed left-0 top-0 z-[71] hidden h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay-500 [@media(hover:hover)and(pointer:fine)]:block'
			/>
		</>
	);
};
