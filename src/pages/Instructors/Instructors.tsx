import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { AppDispatch, RootState } from '../../redux/store';
import { InstructorPortraitCard, type InstructorPortraitCardData } from '../../features/instructor';
import { getInstructorAction } from '../../redux/actions/instructorAction';
import { InstructorType } from '../../redux/api/instructorApi';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { resolveInstructor } from '../../util/helperFunctions/instructorDisplay';
import { cn } from '../../lib/cn';

type CardSize = 'feature' | 'default';

const sizeForIndex = (i: number): CardSize =>
	i === 0 || i % 9 === 4 ? 'feature' : 'default';

const colSpanClass: Record<CardSize, string> = {
	feature: 'col-span-2 sm:col-span-2 lg:col-span-2',
	default: 'col-span-1',
};

const toPortraitCard = (instructor: InstructorType): InstructorPortraitCardData => {
	const display = resolveInstructor(instructor);
	return {
		_id: instructor._id,
		to: display.profilePath,
		name: display.name,
		expertise: instructor.expertise,
		photo: display.photo,
		isYouTube: display.isYouTube,
	};
};

const InstructorCardSkeleton = ({ wide }: { wide?: boolean }) => (
	<div
		className={cn(
			'animate-pulse rounded-card bg-bg-raised',
			wide ? 'aspect-[4/5] sm:min-h-[640px]' : 'aspect-[4/5]',
		)}
	/>
);

const Instructors: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const instructors = useSelector(
		(state: RootState) => state.instructor.instructors.data
	);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(getInstructorAction({ page: '1', limit: '20' }));
	}, [dispatch]);

	const filtered = instructors
		? search.length < 2
			? instructors
			: instructors.filter(
				(ins: InstructorType) =>
					resolveInstructor(ins).name.toLowerCase().includes(search.toLowerCase()) ||
					ins.expertise?.toLowerCase().includes(search.toLowerCase()),
			)
		: null;

	const skeletons = Array.from({ length: 12 }, (_, i) => i);

	return (
		<PageLayout width='default' className='pt-16 sm:pt-24 pb-12'>
			{/* Editorial header */}
			<div className='mb-12 sm:mb-16 max-w-3xl'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					The faculty
				</span>
				<Reveal
					mode='word-split'
					as='h1'
					className='mt-5 font-display font-semibold text-5xl sm:text-6xl lg:text-7xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
				>
					Meet the makers.
				</Reveal>
				<p className='mt-6 font-body text-lg text-ink-secondary leading-[1.6] max-w-xl'>
					Every instructor is a practitioner first. They built what they teach —
					and they&apos;re still building.
				</p>
			</div>

			{/* Floating search pill */}
			<div className='sticky top-4 z-30 mb-10'>
				<div className='glass rounded-pill px-2 py-2 flex items-center gap-2 max-w-2xl mx-auto shadow-warm-2'>
					<span className='inline-grid place-items-center h-10 w-10 text-ink-secondary'>
						<Search size={16} strokeWidth={2} />
					</span>
					<input
						type='text'
						placeholder='Search by name or expertise…'
						value={search}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
						className='flex-1 bg-transparent outline-none text-ink-primary placeholder:text-ink-tertiary font-body text-sm'
					/>
					{search.length > 0 && (
						<button
							type='button'
							onClick={() => setSearch('')}
							className='h-7 w-7 rounded-full grid place-items-center text-ink-tertiary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors font-body text-xs'
							aria-label='Clear search'
						>
							✕
						</button>
					)}
				</div>
			</div>

			{/* Instructor grid */}
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
				{filtered === null
					? skeletons.map((idx) => (
						<div key={idx} className={colSpanClass[sizeForIndex(idx)]}>
							<InstructorCardSkeleton wide={sizeForIndex(idx) === 'feature'} />
						</div>
					))
					: filtered.length === 0
						? (
							<div className='col-span-2 sm:col-span-3 lg:col-span-4 py-24 grid place-items-center text-center gap-3'>
								<h3 className='font-display font-semibold text-3xl text-ink-primary leading-tight'>
									No instructors found.
								</h3>
								<p className='font-body text-sm text-ink-tertiary'>
									Try a different search term.
								</p>
								<button
									type='button'
									onClick={() => setSearch('')}
									className='mt-2 inline-flex items-center h-10 px-5 rounded-pill border border-line-base text-ink-primary hover:border-line-strong transition-colors font-body text-sm'
								>
									Clear search
								</button>
							</div>
						)
						: filtered.map((instructor: InstructorType, idx: number) => {
							const size = sizeForIndex(idx);
							return (
								<div key={instructor._id} className={colSpanClass[size]}>
									<InstructorPortraitCard
										instructor={toPortraitCard(instructor)}
										size={size}
									/>
								</div>
							);
						})}
			</div>
		</PageLayout>
	);
};

export default Instructors;
