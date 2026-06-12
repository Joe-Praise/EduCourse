import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceQuery =
	typeof window !== 'undefined'
		? window.matchMedia('(prefers-reduced-motion: reduce)')
		: null;

const applyMotionDefaults = (prefersReduce: boolean): void => {
	gsap.defaults({
		duration: prefersReduce ? 0 : 0.2,
		ease: 'power3.out',
	});
};

if (reduceQuery) {
	applyMotionDefaults(reduceQuery.matches);
	reduceQuery.addEventListener('change', (event) => applyMotionDefaults(event.matches));
} else {
	applyMotionDefaults(false);
}

export const prefersReducedMotion = (): boolean => reduceQuery?.matches ?? false;

export { gsap, ScrollTrigger };
