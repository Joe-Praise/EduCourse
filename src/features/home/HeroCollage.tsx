import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { cn } from '../../lib/cn';
import type { CourseCardData } from '../course/CourseCard';

interface HeroCollageProps {
	courses: ReadonlyArray<CourseCardData>;
}

/**
 * Three layered floating cards drifting on cursor parallax.
 * Different magnetic strengths per layer create depth.
 */
export const HeroCollage = ({ courses }: HeroCollageProps) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

	useGSAP(
		() => {
			if (!rootRef.current) return;
			if (prefersReducedMotion()) return;
			// Idle float
			layerRefs.current.forEach((layer, i) => {
				if (!layer) return;
				gsap.to(layer, {
					y: '+=12',
					duration: 3.5 + i * 0.4,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1,
				});
			});
		},
		{ scope: rootRef },
	);

	useEffect(() => {
		if (prefersReducedMotion()) return;
		if (typeof window === 'undefined') return;
		if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

		const root = rootRef.current;
		if (!root) return;

		const strengths = [0.06, 0.12, 0.22];

		const onMove = (e: MouseEvent) => {
			const rect = root.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = e.clientX - cx;
			const dy = e.clientY - cy;
			layerRefs.current.forEach((layer, i) => {
				if (!layer) return;
				const s = strengths[i] ?? 0.1;
				gsap.to(layer, {
					x: dx * s,
					y: dy * s * 0.5,
					duration: 0.8,
					ease: 'power3.out',
					overwrite: 'auto',
				});
				gsap.to(layer, { rotate: dx * s * 0.05, duration: 1.2, ease: 'power3.out' });
			});
		};

		window.addEventListener('mousemove', onMove);
		return () => window.removeEventListener('mousemove', onMove);
	}, []);

	const setLayerRef = (idx: number) => (node: HTMLDivElement | null) => {
		layerRefs.current[idx] = node;
	};

	// Fallback art if no courses yet
	const slots: Array<{ title: string; instructor: string; image?: string }> = courses.length
		? courses.slice(0, 3).map((c) => ({
				title: c.title,
				instructor: c.instructors?.[0]?.userId?.name ?? '',
				image: c.imageCover,
		  }))
		: [
				{ title: 'Type at scale', instructor: 'Jules Tan' },
				{ title: 'Systems-thinking for designers', instructor: 'Mara Llewellyn' },
				{ title: 'Building with restraint', instructor: 'Owen Greaves' },
		  ];

	return (
		<div ref={rootRef} className='relative w-full h-full'>
			{/* Back card — tilted left */}
			<div
				ref={setLayerRef(0)}
				className={cn(
					'absolute left-[6%] top-[8%] w-[62%] aspect-[4/5] rounded-card overflow-hidden',
					'bg-bg-raised shadow-warm-2 -rotate-[6deg] will-change-transform',
				)}
			>
				{slots[0]?.image ? (
					<img
						src={imgSrc(slots[0].image, '/course/', TRANSFORMS.courseCoverCard)}
						alt=''
						className='absolute inset-0 h-full w-full object-cover'
					/>
				) : (
					<div className='absolute inset-0 bg-gradient-to-br from-sienna-600/30 to-bg-overlay' />
				)}
				<div className='absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-bg-base/95 to-transparent'>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
						Lesson 03
					</span>
					<h4
						className='mt-1 font-display font-semibold text-lg text-ink-primary leading-[1.2] line-clamp-2'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						{slots[0]?.title}
					</h4>
				</div>
			</div>

			{/* Front card — center, larger */}
			<div
				ref={setLayerRef(1)}
				className={cn(
					'absolute right-[4%] top-[20%] w-[68%] aspect-[4/5] rounded-card overflow-hidden',
					'bg-bg-raised shadow-warm-3 rotate-[3deg] will-change-transform',
				)}
			>
				{slots[1]?.image ? (
					<img
						src={imgSrc(slots[1].image, '/course/', TRANSFORMS.courseCoverCard)}
						alt=''
						className='absolute inset-0 h-full w-full object-cover'
					/>
				) : (
					<div className='absolute inset-0 bg-gradient-to-br from-clay-500/40 to-bg-overlay' />
				)}
				<div className='absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent'>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-clay-400'>
						Now playing
					</span>
					<h4
						className='mt-1.5 font-display font-semibold text-xl text-ink-primary leading-[1.15] line-clamp-2'
						style={{ fontVariationSettings: '"opsz" 48' }}
					>
						{slots[1]?.title}
					</h4>
					<p className='mt-1 font-body text-xs text-ink-tertiary'>
						with {slots[1]?.instructor}
					</p>
				</div>
			</div>

			{/* Mini badge — bottom-right */}
			<div
				ref={setLayerRef(2)}
				className={cn(
					'absolute right-[8%] bottom-[6%] w-[40%] max-w-[200px] rounded-card p-4',
					'bg-bg-overlay/90 backdrop-blur-md border border-line-base shadow-warm-2',
					'-rotate-[4deg] will-change-transform',
				)}
			>
				<div className='flex items-center gap-2'>
					<span className='inline-block h-2 w-2 rounded-full bg-signal-success animate-pulse' aria-hidden />
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary'>
						Day 12 streak
					</span>
				</div>
				<p
					className='mt-2 font-display font-semibold text-2xl text-ink-primary leading-none tabular-nums'
					style={{ fontVariationSettings: '"opsz" 32' }}
				>
					3 lessons
				</p>
				<p className='font-body text-xs text-ink-tertiary'>today</p>
			</div>
		</div>
	);
};
