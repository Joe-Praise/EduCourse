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

// Fallback names if categories absent — keeps the bento composed during loading.
// These ids are fake, so placeholder tiles render as inert (see `interactive`):
// linking them sent people to /courses?category=1, a dead filter.
const PLACEHOLDER: ReadonlyArray<BentoCategory> = [
	{ _id: '1', name: 'Design Systems', courseCount: 24 },
	{ _id: '2', name: 'Backend Craft', courseCount: 38 },
	{ _id: '3', name: 'Type & Letterform', courseCount: 12 },
	{ _id: '4', name: 'Motion', courseCount: 18 },
	{ _id: '5', name: 'Product Strategy', courseCount: 31 },
	{ _id: '6', name: 'Data Literacy', courseCount: 22 },
	{ _id: '7', name: 'Editorial', courseCount: 9 },
];

// Bento layouts keyed by tile count. Each one packs its rows completely, so a
// catalog with fewer categories than slots doesn't leave a hole in the grid
// (the landing feed only surfaces categories that actually hold courses).
interface BentoLayout {
	rows: string;
	positions: ReadonlyArray<string>;
}

const layouts: Record<number, BentoLayout> = {
	1: { rows: 'sm:grid-rows-1', positions: ['sm:col-span-4'] },
	2: { rows: 'sm:grid-rows-1', positions: ['sm:col-span-2', 'sm:col-span-2'] },
	3: {
		rows: 'sm:grid-rows-2',
		positions: ['sm:col-span-2 sm:row-span-2', 'sm:col-span-2', 'sm:col-span-2'],
	},
	4: {
		rows: 'sm:grid-rows-2',
		positions: [
			'sm:col-span-2 sm:row-span-2',
			'sm:col-span-2',
			'sm:col-span-1',
			'sm:col-span-1',
		],
	},
	5: {
		rows: 'sm:grid-rows-2',
		positions: [
			'sm:col-span-2 sm:row-span-2',
			'sm:col-span-1',
			'sm:col-span-1',
			'sm:col-span-1',
			'sm:col-span-1',
		],
	},
	6: {
		rows: 'sm:grid-rows-3',
		positions: [
			'sm:col-span-2 sm:row-span-2',
			'sm:col-span-1',
			'sm:col-span-1 sm:row-span-2',
			'sm:col-span-1',
			'sm:col-span-2',
			'sm:col-span-2',
		],
	},
	7: {
		rows: 'sm:grid-rows-3',
		positions: [
			'sm:col-span-2 sm:row-span-2', // feature tile, 2×2
			'sm:col-span-1 sm:row-span-1',
			'sm:col-span-1 sm:row-span-2', // tall
			'sm:col-span-1 sm:row-span-1',
			'sm:col-span-1 sm:row-span-1',
			'sm:col-span-2 sm:row-span-1', // wide
			'sm:col-span-1 sm:row-span-1',
		],
	},
};

export const CategoryBento = ({ categories }: CategoryBentoProps) => {
	const hasCategories = Boolean(categories && categories.length > 0);
	const tiles = (hasCategories ? categories! : PLACEHOLDER).slice(0, 7);
	const layout = layouts[tiles.length] ?? layouts[7];

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

				<div
					className={cn(
						'mt-12 grid grid-cols-1 sm:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4',
						layout.rows,
					)}
				>
					{tiles.map((cat, idx) => (
						<BentoTile
						key={cat._id}
						category={cat}
						interactive={hasCategories}
						className={layout.positions[idx] ?? ''}
					/>
					))}
				</div>
			</div>
		</section>
	);
};

interface BentoTileProps {
	category: BentoCategory;
	className?: string;
	/** Placeholder tiles carry fake ids — render them inert rather than as links. */
	interactive?: boolean;
}

const BentoTile = ({ category, className, interactive = true }: BentoTileProps) => {
	const tileClass = cn(
		'group relative isolate overflow-hidden rounded-card',
		'bg-bg-raised border border-line-subtle transition-[border-color,background-color] duration-base',
		interactive && 'hover:border-line-base',
		'p-5 sm:p-6 flex flex-col justify-end',
		className,
	);

	const body = (
		<>
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
					{typeof category.courseCount === 'number'
						? `${category.courseCount} ${category.courseCount === 1 ? 'course' : 'courses'}`
						: 'Explore'}
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
		</>
	);

	// Placeholder tiles stand in while the real categories load. Their ids are
	// invented, so they must not be links — clicking one landed you on
	// /courses?category=1, a filter nothing can satisfy.
	if (!interactive) {
		return (
			<div aria-hidden className={cn(tileClass, 'animate-pulse')}>
				{body}
			</div>
		);
	}

	return (
		<Link
			to={`/courses?category=${encodeURIComponent(category._id)}`}
			data-cursor='grow'
			className={tileClass}
		>
			{body}
		</Link>
	);
};
