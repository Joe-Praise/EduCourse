import { useEffect, type RefObject } from 'react';
import { gsap, prefersReducedMotion } from './motion';

interface MagneticOptions {
	strength?: number;
	radius?: number;
	ease?: string;
}

/**
 * Pulls the referenced element toward the cursor by `strength`
 * (0–1, default 0.3) when the cursor is within `radius` pixels.
 * Returns to (0,0) on mouseleave with a gentle spring.
 * No-op on touch devices and under prefers-reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>(
	ref: RefObject<T>,
	{ strength = 0.3, radius = 120, ease = 'power3.out' }: MagneticOptions = {},
): void {
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (prefersReducedMotion()) return;
		if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
			return;
		}

		let frame = 0;

		const onMove = (event: MouseEvent) => {
			const rect = el.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = event.clientX - cx;
			const dy = event.clientY - cy;
			const distance = Math.hypot(dx, dy);
			if (distance > radius) {
				gsap.to(el, { x: 0, y: 0, duration: 0.5, ease });
				return;
			}
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.35, ease });
			});
		};

		const onLeave = () => {
			cancelAnimationFrame(frame);
			gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
		};

		window.addEventListener('mousemove', onMove);
		el.addEventListener('mouseleave', onLeave);

		return () => {
			window.removeEventListener('mousemove', onMove);
			el.removeEventListener('mouseleave', onLeave);
			cancelAnimationFrame(frame);
			gsap.set(el, { x: 0, y: 0 });
		};
	}, [ref, strength, radius, ease]);
}
