import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

/**
 * Mount Lenis once at app root. Integrates with ScrollTrigger so existing
 * scroll-driven animations continue to work against Lenis-driven scroll.
 * No-op under prefers-reduced-motion (native scroll is more accessible).
 */
export function useLenis(): void {
	const initialized = useRef<boolean>(false);

	useEffect(() => {
		if (initialized.current) return;
		if (prefersReducedMotion()) return;
		initialized.current = true;

		const lenis = new Lenis({
			duration: 1.05,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			touchMultiplier: 1.4,
		});

		const onScroll = () => ScrollTrigger.update();
		lenis.on('scroll', onScroll);

		const onTick = (time: number) => {
			lenis.raf(time * 1000);
		};
		gsap.ticker.add(onTick);
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(onTick);
			lenis.destroy();
			initialized.current = false;
		};
	}, []);
}
