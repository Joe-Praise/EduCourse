import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpRight, ListChecks, NotebookPen } from 'lucide-react';
import VideoSection from '../../components/Lecture Course/VideoSection';
import LectureHeader from '../../components/Lecture Course/LectureHeader';
import { LoadingEffect, TabContainer } from '../../components/shared';
import OverView from '../../components/Single Course/OverView';
import Instructor from '../../components/Single Course/Instructor';
import Review from '../../components/Single Course/Reviews';
import { AppDispatch, RootState } from '../../redux/store';
import {
	getLectureCourseAction,
	lectureCourseType,
	markLessonCompleteAction,
} from '../../redux/actions/courseAction';
import {
	useFocusMode,
	LectureKeyboardSheet,
	FocusToggleButton,
	CurriculumDotRail,
	NotesDrawer,
	LearningStreakWidget,
} from '../../features/lecture';
import { cn } from '../../lib/cn';

type ViewKey = 'overview' | 'instructor' | 'reviews';
const VIEW_ITEMS: Array<{ key: ViewKey; label: string }> = [
	{ key: 'overview', label: 'Overview' },
	{ key: 'instructor', label: 'Instructor' },
	{ key: 'reviews', label: 'Reviews' },
];

interface FlatLesson {
	_id: string;
	title: string;
	moduleTitle: string;
	duration?: string;
	/** YouTube video id (or URL — VideoSection extracts the id). */
	url?: string;
}

const LectureCourse: FC = () => {
	const { slug, courseId } = useParams<{ courseId: string; slug: string }>();
	const courseIdString: string = courseId || '';
	const slugString: string = slug || '';

	const dispatch: AppDispatch = useDispatch();
	const lectureCourse = useSelector((state: RootState) => state.course.lectureCourse);
	const courseError = useSelector((state: RootState) => state.course.courseError);
	const userId = useSelector((state: RootState) => state.user.userObj?._id);

	const [activeView, setActiveView] = useState<ViewKey>('overview');
	const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);
	const [railOpen, setRailOpen] = useState<boolean>(false);
	const [notesOpen, setNotesOpen] = useState<boolean>(false);
	const resumeAppliedRef = useRef<string>('');

	useEffect(() => {
		const details: lectureCourseType = { courseId: courseIdString, userId };
		dispatch(getLectureCourseAction(details));
	}, [dispatch, courseIdString, userId]);

	const { focused, toggle: toggleFocus } = useFocusMode();

	const lessons: ReadonlyArray<FlatLesson> = useMemo(() => {
		const modules = lectureCourse?.modules ?? [];
		const flat: FlatLesson[] = [];
		for (const m of modules) {
			const moduleTitle = m.title ?? '';
			for (const lesson of m.lessons ?? []) {
				flat.push({
					_id: lesson._id,
					title: lesson.title,
					moduleTitle,
					duration: lesson.duration,
					url: (lesson as { url?: string }).url,
				});
			}
		}
		return flat;
	}, [lectureCourse?.modules]);

	// Resume on the user's last-viewed lesson when the course data lands.
	// Once applied per course-load, don't override the user's manual navigation.
	useEffect(() => {
		const completedIds: ReadonlyArray<string> =
			lectureCourse?.course?.completedLessons ?? [];
		if (lessons.length === 0) return;
		const key = `${courseIdString}:${lessons.length}:${completedIds.length}`;
		if (resumeAppliedRef.current === key) return;
		resumeAppliedRef.current = key;

		if (completedIds.length === 0) return; // never started — leave at 0

		const completedSet = new Set(completedIds);
		// First lesson not yet completed = the one to resume on. If they've
		// finished everything, stay on the last one.
		const nextIdx = lessons.findIndex((l) => !completedSet.has(l._id));
		setActiveLessonIdx(nextIdx === -1 ? lessons.length - 1 : nextIdx);
	}, [lectureCourse?.course?.completedLessons, lessons, courseIdString]);

	const currentLesson = lessons[activeLessonIdx];

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				setActiveLessonIdx((i) => Math.min(i + 1, lessons.length - 1));
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				setActiveLessonIdx((i) => Math.max(i - 1, 0));
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [lessons.length]);

	let display;
	if (activeView === 'overview') {
		display = <OverView description={lectureCourse?.course?.description} />;
	} else if (activeView === 'instructor') {
		display = <Instructor instructors={lectureCourse?.course?.instructors} />;
	} else {
		display = <Review course={lectureCourse?.course} />;
	}

	return (
		<div className='relative isolate min-h-screen bg-bg-sunken'>
			<LectureHeader onWindowSize={typeof window !== 'undefined' ? window.innerWidth : 1280} courseTitle={slugString} />

			{lectureCourse?.course?._id ? (
				<>
					{/* Eyebrow + focus toggle */}
					<div
						className={cn(
							'flex items-center justify-between px-6 sm:px-8 lg:px-12 pt-6 pb-3 transition-opacity duration-base',
							focused && 'opacity-0 hover:opacity-100',
						)}
					>
						<div className='flex flex-col leading-tight'>
							<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
								{currentLesson?.moduleTitle ?? 'Module'}
							</span>
							<h1
								className='mt-1 font-display font-semibold text-xl sm:text-2xl text-ink-primary tracking-[-0.02em] truncate'
								style={{ fontVariationSettings: '"opsz" 32' }}
							>
								{currentLesson?.title ?? lectureCourse.course.title}
							</h1>
						</div>
						<FocusToggleButton focused={focused} onToggle={toggleFocus} />
					</div>

					{/* Video — centered with max-width, lg+ leaves room for right rail */}
					<div className='px-6 sm:px-8 lg:px-12 lg:pr-[64px]'>
						<div
							className={cn(
								'mx-auto w-full max-w-[1280px] rounded-card overflow-hidden bg-bg-sunken',
								'transition-[transform] duration-slow ease-out-quart',
								focused && 'lg:scale-[1.04]',
							)}
						>
							<VideoSection
								videoId={currentLesson?.url}
								onEnded={() => {
									// 1) Mark the just-finished lesson complete (optimistic +
									//    server-side PATCH). 2) Advance to the next lesson if
									//    there is one.
									const completedCourseId =
										lectureCourse?.course?.completedCourseId;
									if (completedCourseId && currentLesson?._id) {
										const alreadyDone = (
											lectureCourse?.course?.completedLessons ?? []
										).includes(currentLesson._id);
										if (!alreadyDone) {
											dispatch(
												markLessonCompleteAction(
													completedCourseId,
													currentLesson._id,
												),
											);
										}
									}
									setActiveLessonIdx((i) =>
										Math.min(i + 1, lessons.length - 1),
									);
								}}
							/>
						</div>

						{/* Quiet action row */}
						<div
							className={cn(
								'mx-auto w-full max-w-[1280px] mt-4 flex items-center justify-between transition-opacity duration-base',
								focused && 'opacity-0 hover:opacity-100',
							)}
						>
							<button
								type='button'
								onClick={() => setActiveLessonIdx((i) => Math.max(i - 1, 0))}
								disabled={activeLessonIdx === 0}
								className='inline-flex items-center gap-2 h-10 px-4 rounded-pill text-ink-secondary hover:text-ink-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-body text-sm'
							>
								← Prev
							</button>

							<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary tabular-nums'>
								Lesson {activeLessonIdx + 1} / {lessons.length}
							</span>

							<button
								type='button'
								onClick={() => setActiveLessonIdx((i) => Math.min(i + 1, lessons.length - 1))}
								disabled={activeLessonIdx === lessons.length - 1}
								className='inline-flex items-center gap-2 h-10 px-4 rounded-pill text-ink-secondary hover:text-ink-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-body text-sm'
							>
								Next →
							</button>
						</div>

						{/* Tabs below */}
						<div
							className={cn(
								'mx-auto w-full max-w-[1280px] mt-12 transition-opacity duration-base',
								focused && 'opacity-30 hover:opacity-100 motion-reduce:opacity-100',
							)}
						>
							<TabContainer
								lecture
								buttons={
									<>
										{VIEW_ITEMS.map((item) => (
											<li
												key={item.key}
												className={cn(
													'p-2 py-5 cursor-pointer flex justify-center items-center text-sm font-medium font-body transition-colors',
													activeView === item.key
														? 'text-clay-400'
														: 'text-ink-tertiary hover:text-ink-secondary',
												)}
												onClick={() => setActiveView(item.key)}
											>
												{item.label}
											</li>
										))}
									</>
								}
							>
								{display}
							</TabContainer>
						</div>
					</div>

					{/* Right edge dot rail */}
					<div
						className={cn(
							'transition-opacity duration-base',
							focused && 'opacity-0 pointer-events-none',
						)}
					>
						<CurriculumDotRail
							lessons={lessons}
							activeIndex={activeLessonIdx}
							completedIds={lectureCourse?.course?.completedLessons ?? []}
							onSelect={(_id, idx) => setActiveLessonIdx(idx)}
							open={railOpen}
							onOpenChange={setRailOpen}
						/>
					</div>

					{/* Bottom-left streak widget — desktop only.
						 On mobile it overlapped the content text. */}
					<div
						className={cn(
							'fixed left-6 bottom-20 z-20 transition-opacity duration-base',
							'hidden lg:block',
							focused && 'opacity-0',
						)}
					>
						<LearningStreakWidget days={12} lessonsToday={3} />
					</div>

					<NotesDrawer
						lessonId={currentLesson?._id ?? lectureCourse.course._id}
						open={notesOpen}
						onOpenChange={setNotesOpen}
					/>
					<LectureKeyboardSheet />

					{/* Mobile dock — single bottom-right floating cluster that drives
						 the lessons panel + notes drawer. The desktop versions of
						 these triggers (rail edge tab + NotesDrawer's own button)
						 are hidden on small screens, so this is the sole mobile
						 entry point. */}
					<div
						className={cn(
							'fixed right-4 bottom-4 z-30 flex flex-col gap-2 lg:hidden',
							focused && 'opacity-0 pointer-events-none',
						)}
					>
						<button
							type='button'
							data-rail-trigger
							onClick={() => setRailOpen((v) => !v)}
							aria-label={railOpen ? 'Close lessons' : 'Open lessons'}
							aria-expanded={railOpen}
							className='inline-grid place-items-center h-12 w-12 rounded-full glass border border-line-base text-ink-secondary hover:text-ink-primary shadow-warm-2 transition-colors'
						>
							<ListChecks size={18} strokeWidth={1.75} />
						</button>
						<button
							type='button'
							onClick={() => setNotesOpen((v) => !v)}
							aria-label={notesOpen ? 'Close notes' : 'Open notes'}
							aria-expanded={notesOpen}
							className='inline-grid place-items-center h-12 w-12 rounded-full glass border border-line-base text-ink-secondary hover:text-ink-primary shadow-warm-2 transition-colors'
						>
							<NotebookPen size={18} strokeWidth={1.75} />
						</button>
					</div>
				</>
			) : courseError ? (
				<div className='min-h-[70svh] grid place-items-center px-6'>
					<div className='max-w-md text-center flex flex-col items-center gap-5'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							Locked
						</span>
						<h2
							className='font-display font-semibold text-3xl sm:text-4xl text-ink-primary tracking-[-0.03em] leading-[1.05]'
							style={{ fontVariationSettings: '"opsz" 96' }}
						>
							You don&apos;t have access to this lecture.
						</h2>
						<p className='font-body text-sm text-ink-secondary leading-[1.6]'>
							Enroll in the course to unlock every lesson, the curriculum, and your
							certificate at the end.
						</p>
						<div className='flex flex-wrap items-center gap-3 mt-2'>
							<Link
								to={`/courses/${slugString}`}
								className='inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
							>
								View the course
								<ArrowUpRight size={14} strokeWidth={2} />
							</Link>
							<Link
								to='/my-courses/learning'
								className='inline-flex items-center gap-2 h-11 px-5 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body font-medium text-sm transition-colors'
							>
								My learning
							</Link>
						</div>
					</div>
				</div>
			) : (
				<div className='py-32 grid place-items-center'>
					<LoadingEffect />
				</div>
			)}
		</div>
	);
};

export default LectureCourse;
