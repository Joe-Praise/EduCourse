import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

export type RevealMode = 'fade-up' | 'mask-up' | 'stagger-children' | 'word-split';

interface RevealOptions {
	mode?: RevealMode;
	start?: string;
	stagger?: number;
	delay?: number;
	once?: boolean;
}

const splitTextIntoWords = (el: HTMLElement): HTMLSpanElement[] => {
	if (el.dataset.split === 'true') {
		return Array.from(el.querySelectorAll<HTMLSpanElement>('[data-word]'));
	}
	const text = el.textContent ?? '';
	el.textContent = '';
	const words = text.split(/\s+/).filter(Boolean);
	const spans: HTMLSpanElement[] = words.map((word, idx) => {
		const wrap = document.createElement('span');
		wrap.dataset.word = 'true';
		wrap.style.display = 'inline-block';
		wrap.style.overflow = 'hidden';
		const inner = document.createElement('span');
		inner.style.display = 'inline-block';
		inner.textContent = word;
		wrap.appendChild(inner);
		el.appendChild(wrap);
		if (idx < words.length - 1) el.appendChild(document.createTextNode(' '));
		return inner;
	});
	el.dataset.split = 'true';
	return spans;
};

/**
 * Declarative scroll-triggered reveal. Modes:
 * - fade-up: opacity 0→1 + translateY 24→0
 * - mask-up: clip-path inset(100% 0 0 0) → 0 (the "Apple product" reveal)
 * - stagger-children: stagger all direct children with fade-up
 * - word-split: splits innerText into per-word spans, staggers their reveal
 */
export function useReveal<T extends HTMLElement>(
	ref: RefObject<T>,
	{ mode = 'fade-up', start = 'top 85%', stagger = 0.06, delay = 0, once = true }: RevealOptions = {},
): void {
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (prefersReducedMotion()) {
			gsap.set(el, { opacity: 1, y: 0, clipPath: 'inset(0)' });
			return;
		}

		let trigger: ScrollTrigger | undefined;

		if (mode === 'fade-up') {
			gsap.set(el, { opacity: 0, y: 24 });
			trigger = ScrollTrigger.create({
				trigger: el,
				start,
				once,
				onEnter: () =>
					gsap.to(el, { opacity: 1, y: 0, duration: 0.72, delay, ease: 'power3.out' }),
			});
		} else if (mode === 'mask-up') {
			gsap.set(el, { clipPath: 'inset(100% 0 0 0)', opacity: 1 });
			trigger = ScrollTrigger.create({
				trigger: el,
				start,
				once,
				onEnter: () =>
					gsap.to(el, {
						clipPath: 'inset(0% 0 0 0)',
						duration: 0.9,
						delay,
						ease: 'power3.out',
					}),
			});
		} else if (mode === 'stagger-children') {
			const children = Array.from(el.children) as HTMLElement[];
			gsap.set(children, { opacity: 0, y: 20 });
			trigger = ScrollTrigger.create({
				trigger: el,
				start,
				once,
				onEnter: () =>
					gsap.to(children, {
						opacity: 1,
						y: 0,
						duration: 0.6,
						stagger,
						delay,
						ease: 'power3.out',
					}),
			});
		} else if (mode === 'word-split') {
			const words = splitTextIntoWords(el);
			gsap.set(words, { yPercent: 110 });
			trigger = ScrollTrigger.create({
				trigger: el,
				start,
				once,
				onEnter: () =>
					gsap.to(words, {
						yPercent: 0,
						duration: 0.7,
						stagger: 0.04,
						delay,
						ease: 'power3.out',
					}),
			});
		}

		return () => {
			trigger?.kill();
		};
	}, [ref, mode, start, stagger, delay, once]);
}
