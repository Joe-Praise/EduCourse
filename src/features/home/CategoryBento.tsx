import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { cn } from '../../lib/cn';

interface BentoCategory {
	_id: string;
	name: string;
	courseCount?: number;
}

interface CategoryBentoProps {
	categories?: ReadonlyArray<BentoCategory>;
}

// Fallback names if categories absent — keeps the bento composed during loading
const PLACEHOLDER: ReadonlyArray<BentoCategory> = [
	{ _id: '1', name: 'Design Systems', courseCount: 24 },
	{ _id: '2', name: 'Backend Craft', courseCount: 38 },
	{ _id: '3', name: 'Type & Letterform', courseCount: 12 },
	{ _id: '4', name: 'Motion', courseCount: 18 },
	{ _id: '5', name: 'Product Strategy', courseCount: 31 },
	{ _id: '6', name: 'Data Literacy', courseCount: 22 },
	{ _id: '7', name: 'Editorial', courseCount: 9 },
];

// Layout positions for 7 tiles in a 4-col / 3-row asymmetric bento
const tilePositions: ReadonlyArray<string> = [
	'sm:col-span-2 sm:row-span-2', // 0 — feature tile, 2×2
	'sm:col-span-1 sm:row-span-1', // 1
	'sm:col-span-1 sm:row-span-2', // 2 — tall
	'sm:col-span-1 sm:row-span-1', // 3
	'sm:col-span-1 sm:row-span-1', // 4
	'sm:col-span-2 sm:row-span-1', // 5 — wide
	'sm:col-span-1 sm:row-span-1', // 6
];

export const CategoryBento = ({ categories }: CategoryBentoProps) => {
	const tiles = (categories && categories.length > 0 ? categories : PLACEHOLDER).slice(0, 7);

	return (
		<section className='py-24 sm:py-32 lg:py-40'>
			<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8'>
				<Reveal mode='word-split' as='h2' className='font-display font-semibold text-5xl sm:text-6xl text-ink-primary tracking-[-0.03em] max-w-3xl' delay={0.05}>
					Wander through the fields.
				</Reveal>
				<p className='mt-6 max-w-2xl font-body text-lg text-ink-secondary leading-[1.6]'>
					Every category is its own ecosystem — instructors, ateliers, a weekly
					letter. Pick a thread to pull.
				</p>

				<div className='mt-12 grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-3 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4'>
					{tiles.map((cat, idx) => (
						<BentoTile key={cat._id} category={cat} className={tilePositions[idx] ?? ''} />
					))}
				</div>
			</div>
		</section>
	);
};

interface BentoTileProps {
	category: BentoCategory;
	className?: string;
}

const BentoTile = ({ category, className }: BentoTileProps) => (
	<Link
		to={`/courses?category=${encodeURIComponent(category._id)}`}
		data-cursor='grow'
		className={cn(
			'group relative isolate overflow-hidden rounded-card',
			'bg-bg-raised border border-line-subtle hover:border-line-base',
			'transition-[border-color,background-color] duration-base',
			'p-5 sm:p-6 flex flex-col justify-end',
			className,
		)}
	>
		{/* Hover gradient wash */}
		<div className='pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-slow bg-gradient-to-br from-clay-500/10 via-transparent to-sienna-500/5' />

		{/* Polaroid stack peek — bottom-right */}
		<div className='pointer-events-none absolute right-4 bottom-4 sm:right-6 sm:bottom-6 flex items-end gap-[-4px] opacity-50 group-hover:opacity-100 transition-opacity duration-slow'>
			<div className='w-10 h-12 sm:w-12 sm:h-14 rounded-sm bg-bg-overlay border border-line-base translate-y-2 -rotate-[10deg] group-hover:-rotate-[16deg] group-hover:-translate-x-1 transition-transform duration-slow ease-out-quart' />
			<div className='w-10 h-12 sm:w-12 sm:h-14 rounded-sm bg-bg-overlay border border-line-base translate-y-1 -rotate-[2deg] group-hover:rotate-0 transition-transform duration-slow ease-out-quart' />
			<div className='w-10 h-12 sm:w-12 sm:h-14 rounded-sm bg-bg-overlay border border-line-base rotate-[8deg] group-hover:rotate-[14deg] group-hover:translate-x-1 transition-transform duration-slow ease-out-quart' />
		</div>

		<div className='relative z-10 max-w-[70%]'>
			<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
				{typeof category.courseCount === 'number' ? `${category.courseCount} courses` : 'Explore'}
			</span>
			<h3
				className='mt-2 font-display font-semibold text-2xl sm:text-3xl text-ink-primary leading-[1.05] tracking-[-0.02em]'
				style={{ fontVariationSettings: '"opsz" 96' }}
			>
				{category.name}
			</h3>
		</div>

		<span className='absolute right-4 top-4 sm:right-6 sm:top-6 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line-subtle text-ink-tertiary group-hover:border-clay-500 group-hover:text-clay-400 group-hover:rotate-[10deg] transition-[border-color,color,transform] duration-base'>
			<ArrowUpRight size={14} strokeWidth={2} />
		</span>
	</Link>
);
