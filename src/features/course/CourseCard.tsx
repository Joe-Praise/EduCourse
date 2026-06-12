import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock3, GraduationCap, BookOpen, Sparkles } from 'lucide-react';
import { Avatar } from '../../ui';
import { WishlistToggle } from './WishlistToggle';
import { CourseProgressTrack } from './CourseProgressTrack';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { formatAmount } from '../../util/helperFunctions/helper';
import { resolveInstructor, type InstructorLike } from '../../util/helperFunctions/instructorDisplay';
import { cn } from '../../lib/cn';

export interface CourseCardData {
	_id: string;
	slug: string;
	title: string;
	imageCover: string;
	level?: string;
	category?: { name: string; group?: string };
	instructors?: InstructorLike[];
	studentsQuantity?: number;
	totalLessons?: number;
	duration?: string;
	price: number;
	priceDiscount?: number;
	priceCategory?: string;
	// Presence flags an AI/YouTube-imported course → renders the AI badge.
	youtubePlaylistId?: string;
	channelId?: string;
}

export type CourseCardSize = 'portrait' | 'wide' | 'feature';
type CourseCardVariant = 'default' | 'enrolled';

interface CourseCardProps {
	course: CourseCardData;
	size?: CourseCardSize;
	variant?: CourseCardVariant;
	wishlisted?: boolean;
	onToggleWishlist?: (slug: string) => void;
	progressPercent?: number;
	progressLabel?: string;
	className?: string;
	priority?: boolean;
	/** Overrides the card's link target. Defaults to the course detail page
	 *  (`/courses/:slug`). Enrolled cards pass the lecture player path so a
	 *  click jumps straight into the course instead of the sales page. */
	to?: string;
}

const aspectClass: Record<CourseCardSize, string> = {
	portrait: 'aspect-[4/5]',
	wide: 'aspect-[3/2]',
	feature: 'aspect-[16/10] sm:aspect-[2/1]',
};

function CourseCardComponent({
	course,
	size = 'portrait',
	variant = 'default',
	wishlisted = false,
	onToggleWishlist,
	progressPercent,
	progressLabel,
	className,
	priority,
	to,
}: CourseCardProps) {
	const {
		slug,
		title,
		imageCover,
		category,
		level,
		instructors,
		studentsQuantity,
		totalLessons,
		duration,
		price,
		priceDiscount,
		priceCategory,
		youtubePlaylistId,
	} = course;

	const primaryInstructor = instructors?.[0] ? resolveInstructor(instructors[0]) : null;
	const isAiGenerated =
		!!youtubePlaylistId || instructors?.[0]?.source === 'youtube';
	const isFree = priceCategory?.toLowerCase() === 'free' || price === 0;
	const hasDiscount =
		typeof priceDiscount === 'number' && priceDiscount > 0 && priceDiscount < price;
	const displayPrice = hasDiscount ? priceDiscount : price;
	const showEnrolled = variant === 'enrolled';
	const titleOverlay = size !== 'portrait';

	return (
		<article
			className={cn(
				'group relative flex flex-col',
				size === 'feature' && 'sm:col-span-2',
				className,
			)}
		>
			<Link
				to={to ?? `/courses/${slug}`}
				data-cursor='grow'
				className='flex flex-col h-full focus:outline-none focus-visible:shadow-focus-ring rounded-card'
			>
				{/* Cover frame */}
				<div className={cn('relative overflow-hidden rounded-card', aspectClass[size])}>
					<img
						src={imgSrc(imageCover, '/course/', TRANSFORMS.courseCoverCard)}
						alt=''
						loading={priority ? 'eager' : 'lazy'}
						decoding='async'
						width={1280}
						height={720}
						className={cn(
							'absolute inset-0 h-full w-full object-cover will-change-transform',
							'transition-transform duration-slow ease-out-quart',
							'group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
						)}
					/>

					{/* Bottom gradient cover — deepens on hover */}
					<div
						className={cn(
							'pointer-events-none absolute inset-0 transition-opacity duration-base',
							titleOverlay
								? 'bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent opacity-90 group-hover:opacity-100'
								: 'bg-gradient-to-t from-bg-raised via-bg-raised/30 to-transparent opacity-80',
						)}
					/>

					{/* Eyebrow */}
					<span className='absolute left-4 top-4 font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary mix-blend-difference'>
						{category?.name}
						{level && (
							<>
								<span className='mx-1.5 opacity-50'>·</span>
								<span className='text-clay-400'>{level}</span>
							</>
						)}
					</span>

					{/* AI-compiled marker */}
					{isAiGenerated && (
						<span className='absolute left-4 top-10 inline-flex items-center gap-1 rounded-pill bg-bg-base/70 backdrop-blur-sm px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.16em] text-clay-400 ring-1 ring-clay-500/30'>
							<Sparkles size={10} strokeWidth={2} />
							AI
						</span>
					)}

					{/* Bookmark */}
					{onToggleWishlist && (
						<div className='absolute right-3 top-3'>
							<WishlistToggle
								active={wishlisted}
								onToggle={() => onToggleWishlist(slug)}
								label={title}
								size='md'
								hideUntilHover
							/>
						</div>
					)}

					{/* Title overlaid on image — for wide / feature variants */}
					{titleOverlay && (
						<div className='absolute inset-x-0 bottom-0 p-5 sm:p-6'>
							<h3
								className={cn(
									'font-display font-semibold leading-[1.05] tracking-[-0.025em] text-ink-primary',
									size === 'feature' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl',
								)}
								style={{ fontVariationSettings: '"opsz" 144' }}
							>
								<span className='bg-bottom bg-no-repeat bg-gradient-to-r from-clay-500 to-clay-500 [background-size:0%_1px] group-hover:[background-size:100%_1px] transition-[background-size] duration-slow ease-out-quart'>
									{title}
								</span>
							</h3>
						</div>
					)}
				</div>

				{/* Body */}
				<div className={cn('flex flex-1 flex-col pt-4', titleOverlay && 'sm:pt-3')}>
					{/* Title below frame — only for portrait variant */}
					{!titleOverlay && (
						<h3
							className='font-display font-semibold text-xl sm:text-2xl leading-[1.15] tracking-[-0.02em] text-ink-primary line-clamp-2'
							style={{ fontVariationSettings: '"opsz" 32' }}
						>
							<span className='bg-[length:0%_1px] bg-bottom bg-no-repeat bg-gradient-to-r from-clay-500 to-clay-500 group-hover:bg-[length:100%_1px] transition-[background-size] duration-slow ease-out-quart'>
								{title}
							</span>
						</h3>
					)}

					{/* Instructor row */}
					{primaryInstructor && (
						<div className='mt-3 flex items-center gap-2.5'>
							<Avatar
								size='xs'
								src={primaryInstructor.photo ? imgSrc(primaryInstructor.photo, '/img/', TRANSFORMS.avatarSm) : undefined}
								fallback={primaryInstructor.name}
							/>
							<span className='truncate font-body text-sm text-ink-secondary'>
								{primaryInstructor.name}
							</span>
						</div>
					)}

					{/* Meta */}
					<div className='mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-ink-tertiary'>
						{duration && (
							<span className='inline-flex items-center gap-1.5 text-xs tabular-nums'>
								<Clock3 size={13} strokeWidth={1.75} aria-hidden />
								{duration}
							</span>
						)}
						{duration && (typeof totalLessons === 'number' || typeof studentsQuantity === 'number') && (
							<span aria-hidden className='h-3 w-px bg-sienna-500/40' />
						)}
						{typeof totalLessons === 'number' && totalLessons > 0 && (
							<span className='inline-flex items-center gap-1.5 text-xs tabular-nums'>
								<BookOpen size={13} strokeWidth={1.75} aria-hidden />
								{totalLessons} lessons
							</span>
						)}
						{typeof totalLessons === 'number' && typeof studentsQuantity === 'number' && (
							<span aria-hidden className='h-3 w-px bg-sienna-500/40' />
						)}
						{typeof studentsQuantity === 'number' && (
							<span className='inline-flex items-center gap-1.5 text-xs tabular-nums'>
								<GraduationCap size={13} strokeWidth={1.75} aria-hidden />
								{studentsQuantity.toLocaleString()}
							</span>
						)}
					</div>

					{/* Footer */}
					<div className='mt-auto pt-4 border-t border-line-subtle'>
						{showEnrolled ? (
							<div className='flex items-end justify-between gap-3'>
								<div className='flex-1'>
									<CourseProgressTrack value={progressPercent ?? 0} />
									<span className='mt-1.5 inline-block font-body text-xs text-ink-tertiary'>
										{progressLabel ?? `${Math.round(progressPercent ?? 0)}% complete`}
									</span>
								</div>
								<span className='inline-flex items-center gap-1 text-xs font-medium text-clay-400 group-hover:text-clay-500 transition-colors'>
									Continue
									<span className='inline-block transition-transform duration-base ease-out-quart group-hover:translate-x-0.5'>
										→
									</span>
								</span>
							</div>
						) : (
							<div className='flex items-end justify-between'>
								<div className='flex flex-col items-start leading-none'>
									{hasDiscount && !isFree && (
										<span className='font-body text-2xs text-ink-muted line-through tabular-nums'>
											${formatAmount(price)}
										</span>
									)}
									<span
										className={cn(
											'font-display font-semibold text-2xl tabular-nums leading-none',
											isFree ? 'text-signal-success' : 'text-ink-primary',
										)}
										style={{ fontVariationSettings: '"opsz" 32' }}
									>
										{isFree ? 'Free' : `$${formatAmount(displayPrice)}`}
									</span>
								</div>
								<span className='inline-flex items-center gap-1 text-xs font-medium text-clay-400 group-hover:text-clay-500 transition-colors'>
									View course
									<span className='inline-block transition-transform duration-base ease-out-quart group-hover:translate-x-0.5'>
										→
									</span>
								</span>
							</div>
						)}
					</div>
				</div>
			</Link>
		</article>
	);
}

export const CourseCard = memo(CourseCardComponent);
