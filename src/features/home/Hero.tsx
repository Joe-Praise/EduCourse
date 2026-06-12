import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';
import { HeroCollage } from './HeroCollage';
import type { CourseCardData } from '../course/CourseCard';

interface HeroProps {
	courses?: ReadonlyArray<CourseCardData>;
}

export const Hero = ({ courses = [] }: HeroProps) => {
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!rootRef.current) return;
			if (prefersReducedMotion()) return;
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
			tl.from('[data-hero-eyebrow]', { opacity: 0, y: 18, duration: 0.6, delay: 0.1 });
			tl.from('[data-hero-line]', { yPercent: 110, duration: 0.85, stagger: 0.06 }, '-=0.3');
			tl.from('[data-hero-sub]', { opacity: 0, y: 12, duration: 0.6 }, '-=0.4');
			tl.from('[data-hero-cta]', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 }, '-=0.3');
			tl.from('[data-hero-collage]', { opacity: 0, duration: 0.8 }, '-=0.8');
		},
		{ scope: rootRef },
	);

	const collageCourses = courses.slice(0, 3);

	return (
		<section
			ref={rootRef}
			className='relative isolate overflow-hidden bg-warm-radial pt-24 pb-24 sm:pt-32 sm:pb-32 lg:pt-40 lg:pb-40'
		>
			<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8'>
				<div className='grid items-end gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16'>
					{/* Left — typography */}
					<div className='relative z-10'>
						<span
							data-hero-eyebrow
							className='inline-flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'
						>
							<span className='inline-block h-1 w-6 bg-clay-500' aria-hidden />
							A premium learning ecosystem
						</span>

						<h1
							className='mt-6 font-display font-semibold text-ink-primary text-7xl lg:text-8xl'
							style={{ fontVariationSettings: '"opsz" 144' }}
						>
							<span className='block overflow-hidden'>
								<span data-hero-line className='block'>
									Learn the work
								</span>
							</span>
							<span className='block overflow-hidden'>
								<span data-hero-line className='block'>
									the world{' '}
									<em
										className='not-italic font-display italic font-semibold text-clay-500'
										style={{ fontVariationSettings: '"opsz" 144' }}
									>
										actually
									</em>
								</span>
							</span>
							<span className='block overflow-hidden'>
								<span data-hero-line className='block'>
									pays for.
								</span>
							</span>
						</h1>

						<p
							data-hero-sub
							className='mt-8 max-w-xl font-body text-lg text-ink-secondary leading-[1.6]'
						>
							Courses, mentorship and ateliers — taught by people who built the
							thing they teach. Built for the kind of person who finishes.
						</p>

						<div className='mt-10 flex flex-wrap items-center gap-3'>
							<Magnetic strength={0.25}>
								<Link
									data-hero-cta
									data-cursor='grow'
									to='/courses'
									className='inline-flex items-center gap-2 h-12 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors duration-base'
								>
									Browse the catalog
									<ArrowRight size={16} strokeWidth={2} />
								</Link>
							</Magnetic>

							<Magnetic strength={0.2}>
								<button
									data-hero-cta
									data-cursor='grow'
									type='button'
									className='inline-flex items-center gap-2 h-12 px-6 rounded-pill border border-line-base hover:border-line-strong text-ink-secondary hover:text-ink-primary font-body font-medium text-sm transition-colors duration-base'
								>
									<Play size={14} strokeWidth={2} fill='currentColor' />
									Watch the 90-second overview
								</button>
							</Magnetic>
						</div>
					</div>

					{/* Right — collage */}
					<div data-hero-collage className='relative h-[420px] sm:h-[480px] lg:h-[560px]'>
						<HeroCollage courses={collageCourses} />
					</div>
				</div>
			</div>
		</section>
	);
};
