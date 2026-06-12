import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useEdgeAutoScroll } from '../../lib/useEdgeAutoScroll';

interface LessonRef {
	_id: string;
	title: string;
	moduleTitle: string;
	duration?: string;
}

interface CurriculumDotRailProps {
	lessons: ReadonlyArray<LessonRef>;
	activeIndex?: number;
	/** Lesson IDs the user has completed. Powers the progress bar + checkmarks. */
	completedIds?: ReadonlyArray<string>;
	onSelect?: (lessonId: string, index: number) => void;
	/** Optional controlled-open state — for parents that want to drive the
	 *  panel from a mobile button or other external trigger. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/**
 * Editorial curriculum rail — design v2.
 *
 * Old v1 was a column of dots ~48px from the viewport edge, hidden behind a
 * hover catch. Users couldn't find it and the dots overlapped the lecture's
 * Next button. Redesigned to be an **always-visible edge tab** at the absolute
 * right edge, with a clear progress fill + a slide-in panel on click/hover.
 *
 * Award-worthy details:
 *   • Vertical clay fill on the tab itself doubles as a progress indicator.
 *   • Vertically-rotated "CURRICULUM" mono label on the tab — readable when
 *     you tilt your head, distinctive at a glance.
 *   • Panel slides in from outside the viewport (translate-x-full → 0).
 *   • Panel locks-open on click; toggles closed on ESC, outside click, or
 *     clicking the close handle.
 */
export const CurriculumDotRail = ({
	lessons,
	activeIndex = 0,
	completedIds = [],
	onSelect,
	open: controlledOpen,
	onOpenChange,
}: CurriculumDotRailProps) => {
	const [internalOpen, setInternalOpen] = useState<boolean>(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = (next: boolean) => {
		if (!isControlled) setInternalOpen(next);
		onOpenChange?.(next);
	};
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const completedSet = new Set(completedIds);

	// Cursor-driven scroll for the lesson list while the panel is open.
	useEdgeAutoScroll(listRef, open);

	const total = lessons.length;
	const doneCount = completedIds.length;
	const percent = total > 0 ? Math.min(100, (doneCount / total) * 100) : 0;

	// Outside click + ESC close
	useEffect(() => {
		if (!open) return;
		const onClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			// Ignore clicks that originate from an external trigger (e.g. the
			// mobile dock "Lessons" button). Without this check the dock button's
			// click would: (1) close the panel via this outside-click handler,
			// then (2) reopen it via the button's onClick — making the button
			// appear to do nothing.
			if (target?.closest('[data-rail-trigger]')) return;
			if (containerRef.current && !containerRef.current.contains(target as Node)) {
				setOpen(false);
			}
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		document.addEventListener('mousedown', onClick);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('mousedown', onClick);
			document.removeEventListener('keydown', onKey);
		};
	}, [open]);

	if (total === 0) return null;

	return (
		<div
			ref={containerRef}
			className='fixed right-0 top-0 bottom-0 z-30 pointer-events-none'
		>
			{/* ── Edge tab — desktop only. Mobile drives `open` via a separate
				 button in LectureCourse's bottom dock through controlled props. */}
			<button
				type='button'
				onClick={() => setOpen(!open)}
				onMouseEnter={() => setOpen(true)}
				aria-label='Open curriculum'
				aria-expanded={open}
				className={cn(
					'absolute top-1/2 -translate-y-1/2 right-0',
					'pointer-events-auto',
					'group hidden lg:flex flex-col items-center justify-between',
					'h-[200px] w-[28px] py-3',
					'bg-bg-overlay/70 backdrop-blur-md',
					'border-y border-l border-line-base',
					'rounded-l-card',
					'transition-[background-color,border-color] duration-base ease-out-quart',
					'hover:bg-bg-overlay hover:border-line-strong',
					'focus-visible:outline-none focus-visible:shadow-focus-ring',
					open && 'opacity-0 pointer-events-none',
				)}
			>
				{/* Top — N/M numeric */}
				<span className='font-mono text-2xs uppercase tracking-[0.06em] text-ink-secondary tabular-nums leading-none'>
					{doneCount}
					<span className='text-ink-tertiary'>/{total}</span>
				</span>

				{/* Middle — vertical progress fill */}
				<div className='flex-1 w-1.5 my-2 rounded-pill bg-bg-sunken overflow-hidden flex flex-col-reverse'>
					<div
						className={cn(
							'w-full rounded-pill transition-[height] duration-slow ease-out-quart',
							percent === 100 ? 'bg-signal-success' : 'bg-clay-500',
						)}
						style={{ height: `${Math.max(percent, 4)}%` }}
					/>
				</div>

				{/* Bottom — rotated label */}
				<span
					className='font-mono text-2xs uppercase tracking-[0.32em] text-ink-tertiary group-hover:text-clay-400 transition-colors'
					style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
				>
					Lessons
				</span>
			</button>

			{/* ── Slide-in panel ────────────────────────────────────────────────── */}
			<aside
				aria-hidden={!open}
				className={cn(
					'absolute top-0 right-0 bottom-0 w-[360px] max-w-[90vw]',
					'flex flex-col',
					'bg-bg-raised border-l border-line-base shadow-warm-3',
					'transition-transform duration-slow ease-out-quart',
					open
						? 'translate-x-0 pointer-events-auto'
						: 'translate-x-full pointer-events-none',
				)}
			>
				<header className='shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b border-line-subtle'>
					<div className='min-w-0'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							Curriculum
						</span>
						<p className='mt-1 font-display font-semibold text-base text-ink-primary tabular-nums'>
							{activeIndex + 1} of {total}
							<span className='ml-2 font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
								· {doneCount} done
							</span>
						</p>
					</div>
					<button
						type='button'
						onClick={() => setOpen(false)}
						aria-label='Close curriculum'
						className='inline-grid place-items-center h-9 w-9 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/60 transition-colors shrink-0'
					>
						<ChevronLeft size={16} strokeWidth={1.75} />
					</button>
				</header>

				{/* Underline progress */}
				<div className='shrink-0 h-0.5 bg-line-subtle/40'>
					<div
						className={cn(
							'h-full transition-[width] duration-slow ease-out-quart',
							percent === 100 ? 'bg-signal-success' : 'bg-clay-500',
						)}
						style={{ width: `${percent}%` }}
					/>
				</div>

				<ul ref={listRef} className='flex-1 min-h-0 overflow-y-auto overscroll-contain py-2'>
					{lessons.map((lesson, idx) => {
						const isActive = idx === activeIndex;
						const isDone = completedSet.has(lesson._id);
						return (
							<li key={lesson._id}>
								<button
									type='button'
									onClick={() => {
										onSelect?.(lesson._id, idx);
										// Keep panel open on lesson change so user can continue
										// navigating without re-triggering.
									}}
									className={cn(
										'w-full text-left px-5 py-3 flex items-start gap-3 transition-colors',
										isActive
											? 'bg-clay-500/10 text-ink-primary'
											: 'text-ink-secondary hover:bg-bg-overlay/40 hover:text-ink-primary',
									)}
								>
									<span
										className={cn(
											'mt-0.5 inline-grid place-items-center h-6 w-6 rounded-full font-mono text-2xs shrink-0 transition-colors',
											isActive
												? 'bg-clay-500 text-ink-primary'
												: isDone
													? 'bg-clay-500/20 text-clay-400 border border-clay-500/30'
													: 'bg-bg-overlay text-ink-tertiary',
										)}
									>
										{isDone && !isActive ? (
											<Check size={11} strokeWidth={2.5} />
										) : (
											idx + 1
										)}
									</span>
									<span className='flex-1 min-w-0'>
										<span
											className={cn(
												'block font-body text-sm leading-tight truncate',
												isDone && !isActive && 'text-ink-tertiary',
											)}
										>
											{lesson.title}
										</span>
										<span className='block font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary mt-0.5 truncate'>
											{lesson.moduleTitle}
										</span>
									</span>
									{lesson.duration && (
										<span className='shrink-0 font-mono text-2xs text-ink-tertiary tabular-nums mt-0.5'>
											{lesson.duration}
										</span>
									)}
								</button>
							</li>
						);
					})}
				</ul>
			</aside>
		</div>
	);
};
