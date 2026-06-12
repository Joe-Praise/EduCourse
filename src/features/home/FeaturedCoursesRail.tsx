import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CourseCard, type CourseCardData } from '../course/CourseCard';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { cn } from '../../lib/cn';

interface FeaturedCoursesRailProps {
	courses?: ReadonlyArray<CourseCardData>;
}

export const FeaturedCoursesRail = ({ courses = [] }: FeaturedCoursesRailProps) => {
	const railRef = useRef<HTMLDivElement>(null);

	const scrollBy = (direction: 1 | -1) => {
		const rail = railRef.current;
		if (!rail) return;
		const cardWidth = rail.querySelector('[data-rail-card]')?.clientWidth ?? 400;
		rail.scrollBy({ left: (cardWidth + 24) * direction, behavior: 'smooth' });
	};

	if (courses.length === 0) return null;

	return (
		<section className='py-24 sm:py-32 lg:py-40 overflow-hidden'>
			<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8'>
				<div className='flex flex-wrap items-end justify-between gap-6 mb-12'>
					<div className='max-w-2xl'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							Featured this season
						</span>
						<Reveal
							mode='word-split'
							as='h2'
							className='mt-4 font-display font-semibold text-5xl sm:text-6xl text-ink-primary tracking-[-0.03em] leading-[1.05]'
						>
							Editor's selection.
						</Reveal>
					</div>
					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={() => scrollBy(-1)}
							aria-label='Previous'
							className='inline-grid place-items-center h-11 w-11 rounded-full border border-line-base hover:border-line-strong text-ink-secondary hover:text-ink-primary transition-colors duration-base'
						>
							<ArrowLeft size={16} strokeWidth={2} />
						</button>
						<button
							type='button'
							onClick={() => scrollBy(1)}
							aria-label='Next'
							className='inline-grid place-items-center h-11 w-11 rounded-full border border-line-base hover:border-line-strong text-ink-secondary hover:text-ink-primary transition-colors duration-base'
						>
							<ArrowRight size={16} strokeWidth={2} />
						</button>
					</div>
				</div>
			</div>

			<div
				ref={railRef}
				className={cn(
					'flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 sm:scroll-px-8 lg:scroll-px-[calc((100vw-1280px)/2+2rem)]',
					'px-4 sm:px-6 lg:px-[calc((100vw-1280px)/2+2rem)]',
					'pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
				)}
			>
				{courses.slice(0, 8).map((course) => (
					<div
						key={course._id}
						data-rail-card
						className='snap-start shrink-0 w-[80vw] sm:w-[60vw] md:w-[480px]'
					>
						<CourseCard course={course} size='wide' />
					</div>
				))}
			</div>
		</section>
	);
};
