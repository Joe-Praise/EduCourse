import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
	FaYoutube,
	FaLinkedin,
	FaTwitter,
	FaGithub,
	FaInstagram,
	FaFacebook,
	FaGlobe,
} from 'react-icons/fa';
import { AppDispatch, RootState } from '../../redux/store';
import {
	getPublicProfileAction,
	resetPublicProfileAction,
	Link as SocialLinkType,
} from '../../redux/actions/publicProfileAction';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { LoadingEffect, RichTextDisplay } from '../../components/shared';
import {
	CourseCard,
	type CourseCardData,
	type CourseCardSize,
} from '../../features/course';

interface ProfileUser {
	_id: string;
	name: string;
	email?: string;
	photo?: string;
	createdAt?: string;
	userId?: { _id: string; name: string; email: string; photo: string };
	title?: string;
	expertise?: string;
	description?: string;
	links?: SocialLinkType[];
}

const PLATFORM_ICON: Record<string, JSX.Element> = {
	youtube:   <FaYoutube className='w-4 h-4' />,
	linkedin:  <FaLinkedin className='w-4 h-4' />,
	twitter:   <FaTwitter className='w-4 h-4' />,
	github:    <FaGithub className='w-4 h-4' />,
	instagram: <FaInstagram className='w-4 h-4' />,
	facebook:  <FaFacebook className='w-4 h-4' />,
};

const SocialPill = ({ link }: { link: SocialLinkType }) => {
	const key = link.platform?.toLowerCase() ?? '';
	const icon = PLATFORM_ICON[key] ?? <FaGlobe className='w-4 h-4' />;
	const label = (link as { displayName?: string }).displayName ?? link.platform;
	return (
		<a
			href={link.url}
			target='_blank'
			rel='noopener noreferrer'
			aria-label={link.platform}
			className='inline-flex items-center gap-2 h-9 pl-3 pr-4 rounded-pill border border-line-base text-ink-primary hover:border-clay-500 hover:text-clay-400 transition-colors font-body text-xs'
		>
			{icon}
			<span className='capitalize'>{label}</span>
		</a>
	);
};

const sizeForIndex = (i: number): CourseCardSize =>
	i % 11 === 5 ? 'feature' : i % 7 === 3 ? 'wide' : 'portrait';

const colSpanClass: Record<CourseCardSize, string> = {
	portrait: 'sm:col-span-3 lg:col-span-2',
	wide:     'sm:col-span-3 lg:col-span-3',
	feature:  'sm:col-span-6 lg:col-span-6',
};

const PublicProfile: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const publicProfile = useSelector(
		(state: RootState) => state.publicProfile.publicProfile,
	);
	const { slug } = useParams<{ slug: string }>();
	const slugString: string = slug || '';

	useEffect(() => {
		dispatch(resetPublicProfileAction());
		dispatch(getPublicProfileAction(slugString, null));
	}, [dispatch, slugString]);

	const user = publicProfile?.user as unknown as ProfileUser | undefined;
	const isInstructor = publicProfile?.isInstructor ?? false;
	const courses = (publicProfile?.courses as unknown as CourseCardData[] | undefined) ?? [];

	// Normalize: for instructors, photo/name live on user.userId; for regular users, on user directly.
	const photo = isInstructor ? user?.userId?.photo : user?.photo;
	const name = isInstructor ? user?.userId?.name : user?.name;

	const memberSince = useMemo(() => {
		if (!user?.createdAt) return null;
		try {
			return new Date(user.createdAt).getFullYear();
		} catch {
			return null;
		}
	}, [user?.createdAt]);

	const stats = useMemo(() => {
		if (!isInstructor) {
			return [
				{ value: String(courses.length), label: 'Enrolled' },
				...(memberSince ? [{ value: String(memberSince), label: 'Member since' }] : []),
			];
		}
		const courseList = courses;
		const totalStudents = courseList.reduce(
			(acc, c) => acc + (c.studentsQuantity ?? 0),
			0,
		);
		const ratingsTotal = courseList.reduce(
			(acc, c) => acc + ((c as unknown as { ratingsAverage?: number }).ratingsAverage ?? 0),
			0,
		);
		const avgRating = courseList.length > 0 ? (ratingsTotal / courseList.length).toFixed(1) : null;
		return [
			{ value: String(courseList.length), label: 'Courses' },
			...(totalStudents > 0 ? [{ value: totalStudents.toLocaleString(), label: 'Students' }] : []),
			...(avgRating ? [{ value: avgRating, label: 'Avg rating', accent: true as const }] : []),
		];
	}, [isInstructor, courses, memberSince]);

	const links = user?.links ?? [];

	if (!publicProfile?.user || !user?._id) {
		return (
			<section className='py-32 grid place-items-center'>
				<LoadingEffect />
			</section>
		);
	}

	const sectionEyebrow = isInstructor
		? user?.expertise ?? 'Instructor'
		: memberSince
		? `Member · ${memberSince}`
		: 'Member';

	return (
		<>
			{/* ── EDITORIAL SPREAD: info left, portrait right ── */}
			<section className='border-b border-line-subtle'>
				<div className='max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:min-h-[78vh]'>
					{/* LEFT: info column */}
					<div className='order-2 lg:order-1 px-5 sm:px-10 lg:px-16 py-14 lg:py-20 flex flex-col justify-center'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							{sectionEyebrow}
						</span>

						<h1
							className='mt-4 font-display font-semibold text-ink-primary leading-[0.92] tracking-[-0.04em]'
							style={{
								fontSize: 'clamp(48px, 7.5vw, 112px)',
								fontVariationSettings: '"opsz" 144',
							}}
						>
							{name}
						</h1>

						{isInstructor && user?.title && (
							<p
								className='mt-6 font-display italic text-ink-primary/85 leading-[1.3] max-w-[480px]'
								style={{
									fontSize: 'clamp(20px, 2vw, 26px)',
									fontVariationSettings: '"opsz" 36',
								}}
							>
								{user.title}
							</p>
						)}

						{!isInstructor && (
							<p className='mt-6 font-body text-base text-ink-primary/80 leading-[1.6] max-w-md'>
								Currently learning across {courses.length}{' '}
								{courses.length === 1 ? 'course' : 'courses'}
								{memberSince ? ` · Joined ${memberSince}` : ''}.
							</p>
						)}

						{/* Stats row */}
						{stats.length > 0 && (
							<div className='mt-10 flex items-start gap-8 sm:gap-12'>
								{stats.map((s, idx) => (
									<div key={idx} className='flex flex-col gap-1'>
										<span
											className={`font-display font-semibold tabular-nums leading-none ${
												'accent' in s && s.accent ? 'text-clay-400' : 'text-ink-primary'
											}`}
											style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontVariationSettings: '"opsz" 72' }}
										>
											{s.value}
										</span>
										<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary'>
											{s.label}
										</span>
									</div>
								))}
							</div>
						)}

						{/* Social links */}
						{links.length > 0 && (
							<div className='mt-10 flex flex-wrap items-center gap-2'>
								{links.map((link) => (
									<SocialPill key={link._id} link={link} />
								))}
							</div>
						)}
					</div>

					{/* RIGHT: portrait image */}
					<div className='order-1 lg:order-2 relative aspect-[4/5] lg:aspect-auto lg:min-h-[78vh] bg-bg-sunken overflow-hidden'>
						{photo ? (
							<img
								src={imgSrc(photo, '/img/', TRANSFORMS.avatarLg)}
								alt={name}
								className='absolute inset-0 h-full w-full object-cover'
							/>
						) : (
							<div
								aria-hidden
								className='absolute inset-0 grid place-items-center bg-bg-raised'
							>
								<span
									className='font-display italic font-semibold text-ink-secondary/30 select-none'
									style={{ fontSize: 'clamp(220px, 32vw, 480px)', fontVariationSettings: '"opsz" 144' }}
								>
									{name?.charAt(0)?.toUpperCase() ?? '?'}
								</span>
							</div>
						)}
						{/* warm edge vignette so it sits on the page, not floating */}
						<div className='pointer-events-none absolute inset-0 lg:bg-gradient-to-l lg:from-transparent lg:to-bg-base/30' />
						<div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-base/40 to-transparent lg:hidden' />
					</div>
				</div>
			</section>

			{/* ── Bio (instructor only) ── */}
			{isInstructor && user?.description && (
				<PageLayout width='default' className='py-20 border-b border-line-subtle'>
					<div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16'>
						<div>
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400 block mb-3'>
								About
							</span>
							<h2
								className='font-display font-semibold text-ink-primary leading-[0.95] tracking-[-0.03em]'
								style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontVariationSettings: '"opsz" 96' }}
							>
								In their words.
							</h2>
						</div>
						<div
							className='prose prose-invert max-w-none
								prose-p:text-ink-primary prose-p:leading-[1.8] prose-p:text-[18px] prose-p:my-5
								prose-strong:text-ink-primary prose-strong:font-semibold
								prose-em:italic prose-em:text-ink-primary
								prose-li:text-ink-primary prose-li:text-[18px] prose-li:leading-[1.7]
								prose-headings:font-display prose-headings:text-ink-primary prose-headings:tracking-[-0.025em]
								prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
								prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
								prose-a:text-clay-400 prose-a:no-underline prose-a:border-b prose-a:border-clay-500/40 hover:prose-a:text-clay-500 hover:prose-a:border-clay-500
								prose-blockquote:border-l-2 prose-blockquote:border-clay-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-ink-primary prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:leading-[1.4]'
						>
							<RichTextDisplay html={user.description} />
						</div>
					</div>
				</PageLayout>
			)}

			{/* ── Courses ── */}
			<PageLayout width='default' className='py-20'>
				<div className='mb-10 flex items-end justify-between gap-4 flex-wrap'>
					<div>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400 block mb-2'>
							{isInstructor ? 'Published work' : 'Enrolled'}
						</span>
						<h2
							className='font-display font-semibold text-ink-primary leading-[0.95] tracking-[-0.03em]'
							style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontVariationSettings: '"opsz" 96' }}
						>
							{courses.length === 0
								? 'Nothing here yet.'
								: courses.length === 1
								? '1 course'
								: `${courses.length} courses`}
						</h2>
					</div>
					{isInstructor && courses.length > 0 && (
						<Link
							to='/courses'
							className='inline-flex items-center gap-1.5 font-body text-sm text-clay-400 hover:text-clay-500 transition-colors'
						>
							Browse full catalog
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
					)}
				</div>

				{courses.length === 0 ? (
					<div className='py-20 grid place-items-center text-center border border-line-subtle rounded-card'>
						<p className='font-body text-sm text-ink-secondary'>
							{isInstructor
								? 'No published courses yet. Check back soon.'
								: 'No enrolled courses yet.'}
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-6 auto-rows-auto gap-6 sm:gap-8'>
						{courses.map((course, idx) => {
							const size = sizeForIndex(idx);
							return (
								<div key={course._id} className={colSpanClass[size]}>
									<CourseCard course={course} size={size} />
								</div>
							);
						})}
					</div>
				)}
			</PageLayout>
		</>
	);
};

export default PublicProfile;
