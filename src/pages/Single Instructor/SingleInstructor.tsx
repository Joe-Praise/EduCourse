import { FC, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Sparkles, Users } from 'lucide-react';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { Badge } from '../../ui';
import { CourseCard, CourseCardSkeleton, type CourseCardData } from '../../features/course';
import { getSingleInstructor } from '../../redux/api/instructorApi';
import { getCourses } from '../../redux/api/courseAPI';
import { InstructorType } from '../../redux/api/instructorApi';
import { resolveInstructor } from '../../util/helperFunctions/instructorDisplay';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';

const formatCount = (n?: number): string => {
	if (!n || n <= 0) return '';
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
	return String(n);
};

const SingleInstructor: FC = () => {
	const { id } = useParams<{ id: string }>();
	const [instructor, setInstructor] = useState<InstructorType | null>(null);
	const [courses, setCourses] = useState<CourseCardData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let active = true;
		if (!id) return;
		setLoading(true);
		setError(false);

		(async () => {
			const [insRes, courseRes] = await Promise.all([
				getSingleInstructor(id),
				getCourses({ page: '1', limit: '12' }, `?instructors=${id}`),
			]);
			if (!active) return;

			const insData = (insRes as { data?: unknown; error?: string })?.data;
			if (!insData || (insRes as { error?: string })?.error) {
				setError(true);
				setLoading(false);
				return;
			}
			setInstructor(insData as InstructorType);
			const courseList = (courseRes as { data?: unknown })?.data;
			setCourses(Array.isArray(courseList) ? (courseList as unknown as CourseCardData[]) : []);
			setLoading(false);
		})();

		return () => {
			active = false;
		};
	}, [id]);

	if (error) {
		return (
			<PageLayout className='py-24'>
				<div className='max-w-md mx-auto text-center flex flex-col items-center gap-4'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						Not found
					</span>
					<h1 className='font-display text-3xl text-ink-primary tracking-[-0.02em]'>
						We couldn&apos;t find that instructor.
					</h1>
					<Link
						to='/instructors'
						className='inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body text-sm transition-colors'
					>
						<ArrowLeft size={15} /> All instructors
					</Link>
				</div>
			</PageLayout>
		);
	}

	const display = instructor ? resolveInstructor(instructor) : null;
	const subs = formatCount(display?.subscriberCount);

	return (
		<PageLayout ambient className='py-10 sm:py-14'>
			<Link
				to='/instructors'
				className='inline-flex items-center gap-2 mb-8 font-body text-sm text-ink-secondary hover:text-ink-primary transition-colors'
			>
				<ArrowLeft size={15} strokeWidth={2} /> All instructors
			</Link>

			{loading || !display ? (
				<div className='flex items-center gap-6 animate-pulse'>
					<div className='h-28 w-28 rounded-full bg-bg-raised' />
					<div className='flex-1 space-y-3'>
						<div className='h-3 w-24 rounded bg-bg-raised' />
						<div className='h-8 w-64 rounded bg-bg-raised' />
						<div className='h-4 w-full max-w-xl rounded bg-bg-raised' />
					</div>
				</div>
			) : (
				<Reveal>
					<header className='flex flex-col sm:flex-row sm:items-center gap-6'>
						<img
							src={imgSrc(display.photo, '/img/', TRANSFORMS.avatarLg)}
							alt={display.name}
							className='h-28 w-28 rounded-full object-cover ring-1 ring-line-base bg-bg-raised shrink-0'
						/>
						<div className='min-w-0'>
							<div className='flex items-center gap-2 mb-2'>
								<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
									The instructor
								</span>
								{display.isYouTube && (
									<Badge tone='info' size='sm'>
										<Sparkles size={11} strokeWidth={2} className='mr-1 inline -mt-0.5' />
										AI-Compiled
									</Badge>
								)}
							</div>
							<h1 className='font-display text-4xl sm:text-5xl text-ink-primary tracking-[-0.03em]'>
								{display.name}
							</h1>
							<div className='flex items-center gap-4 mt-3 text-ink-secondary font-body text-sm'>
								<span>{courses.length} course{courses.length === 1 ? '' : 's'}</span>
								{subs && (
									<span className='inline-flex items-center gap-1.5'>
										<Users size={14} strokeWidth={2} /> {subs} subscribers
									</span>
								)}
								{display.channelUrl && (
									<a
										href={display.channelUrl}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex items-center gap-1 text-clay-400 hover:text-clay-500 transition-colors'
									>
										YouTube channel <ArrowUpRight size={13} strokeWidth={2} />
									</a>
								)}
							</div>
						</div>
					</header>

					{display.bio && (
						<p className='mt-6 max-w-3xl font-body text-base leading-relaxed text-ink-secondary'>
							{display.bio}
						</p>
					)}
				</Reveal>
			)}

			<div className='mt-12'>
				<h2 className='font-display text-2xl text-ink-primary tracking-[-0.02em] mb-6'>
					Courses
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
					{loading ? (
						Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} />)
					) : courses.length > 0 ? (
						courses.map((course) => <CourseCard key={course._id} course={course} />)
					) : (
						<p className='col-span-full font-body text-sm text-ink-tertiary py-8'>
							No published courses from this instructor yet.
						</p>
					)}
				</div>
			</div>
		</PageLayout>
	);
};

export default SingleInstructor;
