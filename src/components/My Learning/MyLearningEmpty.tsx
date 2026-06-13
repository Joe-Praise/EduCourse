import { Link } from 'react-router-dom';
import { BookOpen, FilterX, SearchX, ArrowUpRight } from 'lucide-react';

export type EmptyVariant = 'none' | 'filter' | 'search';

interface MyLearningEmptyProps {
	variant: EmptyVariant;
	/** The current search term — shown in the `search` variant. */
	query?: string;
	/** Clears active filters — wired for the `filter` variant. */
	onClearFilters?: () => void;
	/** Clears the search box — wired for the `search` variant. */
	onClearSearch?: () => void;
}

const COPY: Record<
	EmptyVariant,
	{ eyebrow: string; title: string; body: string; Icon: typeof BookOpen }
> = {
	none: {
		eyebrow: 'Empty shelf',
		title: 'Your library is waiting',
		body: 'Courses you enrol in land here — pick up where you left off, track your progress, and earn your certificate.',
		Icon: BookOpen,
	},
	filter: {
		eyebrow: 'No matches',
		title: 'Nothing fits those filters',
		body: 'None of your enrolled courses match the filters you’ve set. Loosen them up to see more of your shelf.',
		Icon: FilterX,
	},
	search: {
		eyebrow: 'No results',
		title: 'No course by that name',
		body: 'We couldn’t find anything in your library matching your search. Check the spelling or try a broader term.',
		Icon: SearchX,
	},
};

const MyLearningEmpty = ({ variant, query, onClearFilters, onClearSearch }: MyLearningEmptyProps) => {
	const { eyebrow, title, body, Icon } = COPY[variant];

	return (
		<div className='relative my-12 overflow-hidden rounded-surface border border-line-subtle bg-bg-raised'>
			{/* warm wash */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0 opacity-70'
				style={{
					background:
						'radial-gradient(ellipse at 80% 0%, rgba(200,71,46,0.10), transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(184,153,104,0.06), transparent 55%)',
				}}
			/>

			<div className='relative mx-auto flex max-w-readable flex-col items-center px-6 py-20 text-center sm:py-28'>
				<span className='inline-grid h-14 w-14 place-items-center rounded-full border border-line-base bg-bg-overlay text-clay-400'>
					<Icon size={24} strokeWidth={1.6} />
				</span>

				<span className='mt-7 font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					{eyebrow}
				</span>

				<h2
					className='mt-3 font-display font-semibold text-4xl leading-[1.08] tracking-[-0.02em] text-ink-primary'
					style={{ fontVariationSettings: '"opsz" 80' }}
				>
					{variant === 'search' && query ? (
						<>
							No results for{' '}
							<span className='italic text-clay-400'>“{query}”</span>
						</>
					) : (
						title
					)}
				</h2>

				<p className='mt-4 font-body text-base leading-[1.6] text-ink-secondary'>{body}</p>

				<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
					{variant === 'filter' && onClearFilters && (
						<button
							type='button'
							onClick={onClearFilters}
							className='inline-flex h-11 items-center rounded-pill bg-clay-500 px-6 font-body font-medium text-sm text-ink-primary transition-colors hover:bg-clay-600'
						>
							Clear filters
						</button>
					)}
					{variant === 'search' && onClearSearch && (
						<button
							type='button'
							onClick={onClearSearch}
							className='inline-flex h-11 items-center rounded-pill bg-clay-500 px-6 font-body font-medium text-sm text-ink-primary transition-colors hover:bg-clay-600'
						>
							Clear search
						</button>
					)}
					<Link
						to='/courses'
						className='inline-flex h-11 items-center gap-2 rounded-pill border border-line-base px-6 font-body text-sm text-ink-primary transition-colors hover:border-clay-500 hover:text-clay-400'
					>
						Explore courses
						<ArrowUpRight size={15} strokeWidth={2} />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MyLearningEmpty;
