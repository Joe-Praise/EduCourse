import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/motion';

const STORAGE_KEY = 'educourse:preloader:seen';

interface PreloaderProps {
	wordmark?: string;
}

/**
 * First-visit-only intro: charcoal screen, wordmark draws stroke-style
 * (via overflow-clip + translateY), then a horizontal bar wipes upward
 * revealing the page. Total ~1.4s. Skipped on subsequent visits via
 * sessionStorage. Skipped entirely under prefers-reduced-motion.
 */
export const Preloader = ({ wordmark = 'EduCourse' }: PreloaderProps) => {
	const [render, setRender] = useState<boolean>(() => {
		if (typeof window === 'undefined') return false;
		if (prefersReducedMotion()) return false;
		return window.sessionStorage.getItem(STORAGE_KEY) !== '1';
	});

	const rootRef = useRef<HTMLDivElement | null>(null);

	useGSAP(
		() => {
			if (!render) return;
			const root = rootRef.current;
			if (!root) return;
			const wordmarkEl = root.querySelector<HTMLElement>('[data-preloader-wordmark]');
			const inner = root.querySelector<HTMLElement>('[data-preloader-inner]');
			if (!wordmarkEl || !inner) return;

			const tl = gsap.timeline({
				onComplete: () => {
					window.sessionStorage.setItem(STORAGE_KEY, '1');
					setRender(false);
				},
			});

			tl.set(inner, { yPercent: 110 });
			tl.to(inner, { yPercent: 0, duration: 0.7, ease: 'power3.out' });
			tl.to(inner, { yPercent: -10, duration: 0.18, ease: 'power2.in' }, '+=0.3');
			tl.to(root, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '-=0.05');
		},
		{ scope: rootRef, dependencies: [render] },
	);

	useEffect(() => {
		if (!render) return;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, [render]);

	if (!render) return null;

	return (
		<div
			ref={rootRef}
			aria-hidden
			className='fixed inset-0 z-[80] grid place-items-center bg-bg-base'
		>
			<div
				data-preloader-wordmark
				className='overflow-hidden'
				style={{ lineHeight: 0.9 }}
			>
				<span
					data-preloader-inner
					className='inline-block font-display italic font-semibold text-ink-primary'
					style={{
						fontSize: 'clamp(64px, 12vw, 160px)',
						letterSpacing: '-0.04em',
						fontVariationSettings: '"opsz" 144',
					}}
				>
					{wordmark}
				</span>
			</div>
		</div>
	);
};
