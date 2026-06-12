import {
	InstructorPortraitCard,
	type InstructorPortraitCardData,
} from '../instructor/InstructorPortraitCard';
import { Reveal } from '../../patterns/Reveal/Reveal';
import {
	resolveInstructor,
	type InstructorLike,
} from '../../util/helperFunctions/instructorDisplay';

interface InstructorSpotlightGridProps {
	instructors?: ReadonlyArray<InstructorLike & { _id: string; expertise?: string }>;
}

const PLACEHOLDER: ReadonlyArray<InstructorPortraitCardData> = [
	{ _id: 'p1', name: 'Mara Llewellyn', expertise: 'Systems Design', courseCount: 8 },
	{ _id: 'p2', name: 'Owen Greaves', expertise: 'Backend Craft', courseCount: 12 },
	{ _id: 'p3', name: 'Jules Tan', expertise: 'Typography', courseCount: 5 },
	{ _id: 'p4', name: 'Iris Wei', expertise: 'Motion', courseCount: 9 },
];

export const InstructorSpotlightGrid = ({ instructors }: InstructorSpotlightGridProps) => {
	const mapped: InstructorPortraitCardData[] =
		instructors && instructors.length > 0
			? instructors.slice(0, 4).map((i) => {
				const display = resolveInstructor(i);
				return {
					_id: i._id,
					name: display.name,
					photo: display.photo,
					expertise: i.title ?? i.expertise,
					to: display.profilePath,
					isYouTube: display.isYouTube,
				};
			})
			: [...PLACEHOLDER];

	return (
		<section className='py-24 sm:py-32 lg:py-40'>
			<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8'>
				<div className='flex flex-wrap items-end justify-between gap-6 mb-12'>
					<div className='max-w-2xl'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							Voices behind the work
						</span>
						<Reveal
							mode='word-split'
							as='h2'
							className='mt-4 font-display font-semibold text-5xl sm:text-6xl text-ink-primary tracking-[-0.03em] leading-[1.05]'
						>
							The instructors.
						</Reveal>
					</div>
					<p className='max-w-md font-body text-ink-tertiary'>
						Practitioners who built the thing first, then taught it. Not coaches
						who read the book.
					</p>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-3 sm:auto-rows-[320px] gap-3 sm:gap-4'>
					{mapped[0] && <InstructorPortraitCard instructor={mapped[0]} size='feature' />}
					{mapped.slice(1, 4).map((inst) => (
						<InstructorPortraitCard key={inst._id} instructor={inst} />
					))}
				</div>
			</div>
		</section>
	);
};
