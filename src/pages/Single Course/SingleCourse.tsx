import { FC, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GraduationCap, BarChart3, Files, Clock3, ArrowUpRight } from 'lucide-react';
import { Instructor as InstructorSection, Reviews } from '../../components/Single Course';
import { LoadingEffect, RichTextDisplay } from '../../components/shared';
import { AppDispatch, RootState } from '../../redux/store';
import { getSingleCourseAction } from '../../redux/actions/courseAction';
import {
	addToWishlistAction,
	checkWishlistAction,
	removeFromWishlistAction,
} from '../../redux/actions/wishlistAction';
import type { Instructor as InstructorRecord } from '../../redux/api/courseAPI';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import {
	CurriculumTimeline,
	FloatingEnrollmentPill,
	RatingDistributionBar,
} from '../../features/course';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import { resolveInstructor } from '../../util/helperFunctions/instructorDisplay';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';

const SingleCourse: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const singleCourse = useSelector((state: RootState) => state.course?.singleCourse);
	const courseError = useSelector((state: RootState) => state.course.courseError);
	const userId = useSelector((state: RootState) => state.user.userObj?._id);
	const wishlisted = useSelector(
		(state: RootState) =>
			singleCourse?.course?._id
				? !!state.wishlist.wishlisted[singleCourse.course._id]
				: false,
	);
	const wishlistId = useSelector(
		(state: RootState) =>
			singleCourse?.course?._id
				? state.wishlist.wishlistIds[singleCourse.course._id]
				: undefined,
	);
	const { slug } = useParams();

	useEffect(() => {
		dispatch(getSingleCourseAction(slug));
	}, [dispatch, slug]);

	const courseId = singleCourse?.course?._id;
	useEffect(() => {
		if (userId && courseId) {
			dispatch(checkWishlistAction(userId, courseId));
		}
	}, [dispatch, userId, courseId]);

	if (courseError) {
		return (
			<section className='min-h-[70svh] grid place-items-center px-6'>
				<div className='max-w-md text-center flex flex-col items-center gap-5'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						Off the page
					</span>
					<h2
						className='font-display font-semibold text-3xl sm:text-4xl text-ink-primary tracking-[-0.03em] leading-[1.05]'
						style={{ fontVariationSettings: '"opsz" 96' }}
					>
						We couldn&apos;t load this course.
					</h2>
					<p className='font-body text-sm text-ink-secondary leading-[1.6]'>
						The course may have moved or you might be offline. Try again, or head
						back to the catalog.
					</p>
					<div className='flex flex-wrap items-center gap-3 mt-2'>
						<button
							type='button'
							onClick={() => dispatch(getSingleCourseAction(slug))}
							className='inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Try again
						</button>
						<Link
							to='/courses'
							className='inline-flex items-center gap-2 h-11 px-5 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Browse the catalog
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
					</div>
				</div>
			</section>
		);
	}

	if (!singleCourse?.course?._id) {
		return (
			<section className='py-32 grid place-items-center'>
				<LoadingEffect />
			</section>
		);
	}

	const course = singleCourse.course;
	const modules = singleCourse.modules;
	const isEnrolled = singleCourse.isEnrolled;

	const handleToggleWishlist = () => {
		if (!userId) return;
		if (wishlisted && wishlistId) {
			dispatch(removeFromWishlistAction(wishlistId, course._id));
		} else if (!wishlisted) {
			dispatch(addToWishlistAction(userId, course._id));
		}
	};

	const meta: Array<{ icon: typeof GraduationCap; label: string }> = [
		{ icon: GraduationCap, label: `${course.studentsQuantity ?? 0} students` },
		{ icon: BarChart3, label: course.level ?? 'All levels' },
		{ icon: Files, label: `${course.totalLessons ?? 0} lessons` },
		{ icon: Clock3, label: course.duration ?? course.createdAt ?? '' },
	];

	return (
		<>
			{/* Cinematic full-bleed hero */}
			<section className='relative isolate overflow-hidden -mt-px'>
				<div className='relative aspect-[16/9] sm:aspect-[21/9] max-h-[720px] w-full'>
					<img
						src={imgSrc(course.imageCover, '/course/', TRANSFORMS.courseCoverHero)}
						alt=''
						className='absolute inset-0 h-full w-full object-cover'
					/>
					{/* Vignette */}
					<div className='absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-bg-base/30' />
					<div className='absolute inset-0 bg-gradient-to-r from-bg-base/70 via-transparent to-bg-base/30' />
					{/* Title overlay — bottom-left */}
					<div className='absolute inset-x-0 bottom-0 px-6 sm:px-12 lg:px-16 pb-10 sm:pb-16 lg:pb-20'>
						<div className='mx-auto max-w-container'>
							<span className='inline-flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
								{course.category?.name && (
									<span>{capitalizeFirstLetters(course.category.name)}</span>
								)}
								{course.category?.name && course.level && (
									<span aria-hidden className='opacity-50'>·</span>
								)}
								{course.level && <span className='text-ink-secondary'>{course.level}</span>}
							</span>

							<h1
								className='mt-5 font-display font-semibold text-ink-primary tracking-[-0.04em] leading-[0.95]'
								style={{
									fontSize: 'clamp(40px, 6vw, 96px)',
									fontVariationSettings: '"opsz" 144',
								}}
							>
								{course.title}
							</h1>

							{course.instructors && course.instructors.length > 0 && (
								<p className='mt-6 font-body text-base text-ink-secondary'>
									with{' '}
									{(course.instructors as InstructorRecord[]).map((el, index, arr) => {
										const display = resolveInstructor(el);
										return (
											<span key={`${el._id}_inst`}>
												{index > 0 && (index === arr.length - 1 ? ' & ' : ', ')}
												<Link to={display.profilePath}>
													<span className='text-ink-primary hover:text-clay-400 transition-colors'>
														{display.name}
													</span>
												</Link>
											</span>
										);
									})}
								</p>
							)}
						</div>
					</div>
				</div>
				<FloatingEnrollmentPill
					course={course}
					isEnrolled={isEnrolled}
					wishlisted={wishlisted}
					onToggleWishlist={userId ? handleToggleWishlist : undefined}
				/>
			</section>

			<PageLayout width='default' className='pt-16 sm:pt-24 pb-32'>
				{/* Meta strip */}
				<div className='mb-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line-subtle py-6'>
					{meta.map((m, i) => {
						const Icon = m.icon;
						return (
							<span key={i} className='inline-flex items-center gap-2 font-body text-sm text-ink-secondary'>
								<Icon size={14} strokeWidth={1.75} className='text-clay-400' />
								{m.label}
							</span>
						);
					})}
				</div>

				{/* Lead paragraph — Fraunces italic, centered */}
				{course.description && (
					<Reveal mode='fade-up'>
						<div
							className='max-w-readable mx-auto text-center font-display italic font-medium text-ink-primary leading-[1.3] tracking-[-0.02em] mb-24'
							style={{
								fontSize: 'clamp(22px, 2.4vw, 32px)',
								fontVariationSettings: '"opsz" 96',
							}}
						>
							<RichTextDisplay html={course.description.slice(0, 400) + (course.description.length > 400 ? '…' : '')} />
						</div>
					</Reveal>
				)}

				{/* Curriculum — visual timeline */}
				<section id='curriculum' className='scroll-mt-24'>
					<header className='mb-12'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							The work
						</span>
						<Reveal
							mode='word-split'
							as='h2'
							className='mt-4 font-display font-semibold text-4xl sm:text-5xl text-ink-primary tracking-[-0.03em] leading-[1.05]'
						>
							Curriculum.
						</Reveal>
					</header>
					<CurriculumTimeline modules={modules} />
				</section>

				{/* Instructor — light-paper section break */}
				<section id='instructor' className='scroll-mt-24 mt-32 -mx-4 sm:-mx-6 lg:-mx-8'>
					<div className='bg-bg-paper text-bg-base px-6 sm:px-12 lg:px-16 py-20 sm:py-28 rounded-card'>
						<div className='mx-auto max-w-container'>
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-500'>
								The instructor
							</span>
							<Reveal
								mode='word-split'
								as='h2'
								className='mt-4 font-display font-semibold text-4xl sm:text-5xl text-bg-base tracking-[-0.03em] leading-[1.05] mb-12'
							>
								Practitioner first, teacher second.
							</Reveal>
							<div className='[&_p]:text-bg-base/80 [&_h1]:text-bg-base [&_h2]:text-bg-base [&_h3]:text-bg-base [&_a]:text-clay-600'>
								<InstructorSection instructors={course.instructors} />
							</div>
						</div>
					</div>
				</section>

				{/* Reviews — pull-quote treatment */}
				<section id='reviews' className='scroll-mt-24 mt-32'>
					<header className='mb-12'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							From students
						</span>
						<Reveal
							mode='word-split'
							as='h2'
							className='mt-4 font-display font-semibold text-4xl sm:text-5xl text-ink-primary tracking-[-0.03em] leading-[1.05]'
						>
							What people say.
						</Reveal>
					</header>
					<RatingDistributionBar
						average={course.ratingsAverage ?? 0}
						totalCount={course.ratingsQuantity ?? 0}
						className='mb-12'
					/>
					<Reviews course={course} />
				</section>
			</PageLayout>
		</>
	);
};

export default SingleCourse;
