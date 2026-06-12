import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { cn } from '../../lib/cn';

export interface InstructorPortraitCardData {
	_id: string;
	slug?: string;
	/** Full profile path (resolver-provided). Preferred over `slug`. */
	to?: string;
	name: string;
	expertise?: string;
	photo?: string;
	courseCount?: number;
	studentCount?: number;
	isYouTube?: boolean;
}

interface InstructorPortraitCardProps {
	instructor: InstructorPortraitCardData;
	size?: 'default' | 'feature';
	className?: string;
}

const InstructorPortraitCardComponent = ({
	instructor,
	size = 'default',
	className,
}: InstructorPortraitCardProps) => {
	const href =
		instructor.to ??
		(instructor.slug ? `/user/${instructor.slug}` : `/instructors/${instructor._id}`);
	const isFeature = size === 'feature';

	return (
		<article
			className={cn(
				'group relative overflow-hidden rounded-card',
				isFeature ? 'aspect-[4/5] sm:row-span-2 sm:aspect-auto sm:min-h-[640px]' : 'aspect-[4/5]',
				className,
			)}
		>
			<Link
				to={href}
				data-cursor='grow'
				className='absolute inset-0 focus:outline-none focus-visible:shadow-focus-ring'
			>
				{instructor.photo ? (
					<img
						src={imgSrc(instructor.photo, '/img/', TRANSFORMS.avatarSm)}
						alt={instructor.name}
						loading='lazy'
						decoding='async'
						className='absolute inset-0 h-full w-full object-cover will-change-transform transition-transform duration-slow ease-out-quart group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100'
					/>
				) : (
					<div
						aria-hidden
						className='absolute inset-0 grid place-items-center bg-bg-raised'
					>
						<span
							className='font-display italic font-semibold text-ink-secondary/60'
							style={{ fontSize: 'clamp(96px, 12vw, 200px)', fontVariationSettings: '"opsz" 144' }}
						>
							{instructor.name.charAt(0).toUpperCase()}
						</span>
					</div>
				)}

				{/* Deepening gradient cover */}
				<div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/35 to-bg-base/10 transition-opacity duration-base group-hover:opacity-95' />

				{instructor.expertise && (
					<span className='absolute right-4 top-4 font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary mix-blend-difference'>
						{instructor.expertise}
					</span>
				)}

				<div className='absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col gap-2'>
					<h3
						className={cn(
							'font-display font-semibold leading-[1.0] tracking-[-0.03em] text-ink-primary',
							isFeature ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl',
						)}
						style={{ fontVariationSettings: '"opsz" 144' }}
					>
						{instructor.name}
					</h3>

					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3 font-body text-xs text-ink-tertiary tabular-nums'>
							{typeof instructor.courseCount === 'number' && (
								<span>{instructor.courseCount} courses</span>
							)}
							{typeof instructor.courseCount === 'number' && typeof instructor.studentCount === 'number' && (
								<span aria-hidden className='h-3 w-px bg-sienna-500/40' />
							)}
							{typeof instructor.studentCount === 'number' && (
								<span>{instructor.studentCount.toLocaleString()} students</span>
							)}
						</div>

						<span className='translate-y-2 opacity-0 inline-flex items-center gap-1 text-xs font-medium text-ink-primary group-hover:translate-y-0 group-hover:opacity-100 transition-[opacity,transform] duration-slow ease-out-quart motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100'>
							View profile
							<ArrowUpRight size={14} strokeWidth={2} />
						</span>
					</div>
				</div>
			</Link>
		</article>
	);
};

export const InstructorPortraitCard = memo(InstructorPortraitCardComponent);
