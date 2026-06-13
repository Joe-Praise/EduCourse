import { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, Star, Share2, Trophy, ChevronDown, X, Copy, Check } from 'lucide-react';
import { RootState } from '../../redux/reducers';
import { capitalizeFirstLetters, copyToClipBoard } from '../../util/helperFunctions/helper';
import ReviewCourse from './ReviewCourse';
import config from '../../../config';
import { cn } from '../../lib/cn';

interface LectureHeaderProps {
	courseTitle: string;
	/** Kept for backwards compat. Header uses Tailwind breakpoints now. */
	onWindowSize?: number;
}

interface DialogShellProps {
	open: boolean;
	onClose: () => void;
	label: string;
	children: React.ReactNode;
}

/**
 * Small editorial dialog shell — same DNA as ConfirmDialog but a fixed,
 * larger surface for forms (rate course, share course, etc).
 */
const DialogShell = ({ open, onClose, label, children }: DialogShellProps) => {
	useEffect(() => {
		if (!open) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = prevOverflow;
			window.removeEventListener('keydown', onKey);
		};
	}, [open, onClose]);

	if (!open) return null;

	return createPortal(
		<div
			role='dialog'
			aria-modal='true'
			aria-label={label}
			className='fixed inset-0 z-[60] grid place-items-center p-4'
		>
			<button
				type='button'
				aria-label='Close'
				onClick={onClose}
				className='absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default'
			/>
			<div
				className='relative w-full max-w-lg rounded-card border border-line-base bg-bg-raised shadow-warm-3 p-6 sm:p-7'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type='button'
					onClick={onClose}
					aria-label='Close'
					className='absolute top-3 right-3 inline-grid place-items-center h-8 w-8 rounded-full text-ink-tertiary hover:text-ink-primary hover:bg-bg-overlay/60 transition-colors'
				>
					<X size={14} strokeWidth={2} />
				</button>
				{children}
			</div>
		</div>,
		document.body,
	);
};

const ShareDialog = ({
	open,
	onClose,
	url,
}: {
	open: boolean;
	onClose: () => void;
	url: string;
}) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const t = window.setTimeout(() => setCopied(false), 1800);
		return () => window.clearTimeout(t);
	}, [copied]);

	const handleCopy = () => {
		copyToClipBoard(url);
		setCopied(true);
	};

	return (
		<DialogShell open={open} onClose={onClose} label='Share this course'>
			<header className='mb-4'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					Share
				</span>
				<h2
					className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
					style={{ fontVariationSettings: '"opsz" 32' }}
				>
					Pass this course on.
				</h2>
				<p className='mt-2 font-body text-sm text-ink-secondary'>
					Anyone with the link can view the course page.
				</p>
			</header>

			<div className='flex items-center gap-2'>
				<input
					readOnly
					value={url}
					aria-label='Course URL'
					onClick={(e) => (e.target as HTMLInputElement).select()}
					className='flex-1 min-w-0 h-11 px-3.5 rounded-card border border-line-base bg-bg-overlay/40 font-body text-sm text-ink-primary placeholder-ink-tertiary outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-colors'
				/>
				<button
					type='button'
					onClick={handleCopy}
					className={cn(
						'inline-flex items-center gap-2 h-11 px-5 rounded-card font-body font-medium text-sm transition-colors shrink-0',
						copied
							? 'bg-signal-success/20 text-signal-success border border-signal-success/30'
							: 'bg-clay-500 hover:bg-clay-600 text-white',
					)}
				>
					{copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={1.75} />}
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
		</DialogShell>
	);
};

const LectureHeader = ({ courseTitle }: LectureHeaderProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const progressBtnRef = useRef<HTMLDivElement>(null);

	const lectureCourse = useSelector((state: RootState) => state.course.lectureCourse);
	const modules = lectureCourse?.modules;
	const completedLessons: ReadonlyArray<string> =
		lectureCourse?.course?.completedLessons ?? [];

	const [progressOpen, setProgressOpen] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const [reviewOpen, setReviewOpen] = useState(false);

	const summary = useMemo(() => {
		const moduleList = (modules ?? []) as ReadonlyArray<{ lessons?: ReadonlyArray<unknown> }>;
		const total = moduleList.reduce<number>(
			(sum, m) => sum + (m.lessons?.length ?? 0),
			0,
		);
		return { total, completed: Math.min(completedLessons.length, total) };
	}, [modules, completedLessons.length]);

	const percentage = summary.total > 0 ? (summary.completed / summary.total) * 100 : 0;
	const isCertified = summary.total > 0 && summary.completed === summary.total;

	useEffect(() => {
		if (!progressOpen) return;
		const onClick = (e: MouseEvent) => {
			if (progressBtnRef.current && !progressBtnRef.current.contains(e.target as Node)) {
				setProgressOpen(false);
			}
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, [progressOpen]);

	return (
		<header className='sticky top-0 z-40 bg-bg-base/85 backdrop-blur-xl border-b border-line-subtle'>
			<div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4'>
				{/* Left — back + title */}
				<div className='flex items-center gap-3 sm:gap-5 flex-1 min-w-0'>
					<button
						type='button'
						onClick={() => navigate(-1)}
						aria-label='Back'
						className='inline-grid place-items-center h-9 w-9 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors shrink-0'
					>
						<ChevronLeft size={16} strokeWidth={2} />
					</button>

					<div className='hidden sm:block h-5 w-px bg-line-base shrink-0' aria-hidden />

					<button
						type='button'
						onClick={() => navigate(`/courses/${courseTitle}`)}
						className='font-display font-semibold text-sm sm:text-base text-ink-primary hover:text-clay-400 transition-colors truncate text-left'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						{capitalizeFirstLetters(courseTitle)}
					</button>
				</div>

				{/* Right — progress + actions */}
				<div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
					{/* Progress pill */}
					<div ref={progressBtnRef} className='relative'>
						<button
							type='button'
							onClick={() => setProgressOpen((v) => !v)}
							aria-haspopup='true'
							aria-expanded={progressOpen}
							className='inline-flex items-center gap-2.5 h-9 pl-2 pr-3.5 rounded-pill border border-line-base hover:border-line-strong transition-colors group'
						>
							<span className='relative inline-grid place-items-center h-6 w-6 shrink-0'>
								<svg viewBox='0 0 24 24' className='absolute inset-0 -rotate-90' aria-hidden>
									<circle
										cx='12'
										cy='12'
										r='10'
										fill='none'
										stroke='currentColor'
										strokeWidth='2.5'
										className='text-line-base'
									/>
									<circle
										cx='12'
										cy='12'
										r='10'
										fill='none'
										stroke='currentColor'
										strokeWidth='2.5'
										strokeLinecap='round'
										className={isCertified ? 'text-signal-success' : 'text-clay-500'}
										style={{
											strokeDasharray: `${2 * Math.PI * 10}`,
											strokeDashoffset: `${2 * Math.PI * 10 * (1 - percentage / 100)}`,
											transition: 'stroke-dashoffset 320ms ease-out',
										}}
									/>
								</svg>
								<Trophy
									size={10}
									strokeWidth={2}
									className={cn(
										'relative z-10',
										isCertified ? 'text-signal-success' : 'text-clay-400',
									)}
								/>
							</span>
							<span className='hidden md:flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary group-hover:text-ink-primary transition-colors tabular-nums'>
								<span>{summary.completed}/{summary.total}</span>
								<span className='text-ink-tertiary'>·</span>
								<span>Progress</span>
								<ChevronDown
									size={11}
									strokeWidth={2}
									className={cn(
										'transition-transform duration-base ease-out-quart',
										progressOpen && 'rotate-180',
									)}
								/>
							</span>
						</button>

						{progressOpen && (
							<div className='absolute right-0 top-[calc(100%+8px)] w-72 rounded-card border border-line-base bg-bg-raised shadow-warm-3 p-4 z-50'>
								<header className='mb-3'>
									<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
										Your progress
									</span>
									<p className='mt-1 font-display font-semibold text-lg text-ink-primary tabular-nums'>
										{summary.completed} of {summary.total} complete
									</p>
								</header>
								<div className='h-1.5 rounded-pill bg-bg-overlay overflow-hidden mb-3'>
									<div
										className={cn(
											'h-full rounded-pill transition-[width] duration-slow ease-out-quart',
											isCertified ? 'bg-signal-success' : 'bg-clay-500',
										)}
										style={{ width: `${Math.max(percentage, 2)}%` }}
									/>
								</div>
								<p className='font-body text-xs text-ink-tertiary leading-[1.5]'>
									{isCertified ? (
										<>
											You finished the course. Your certificate is in{' '}
											<button
												type='button'
												onClick={() => {
													setProgressOpen(false);
													navigate('/certificates');
												}}
												className='text-clay-400 hover:text-clay-500 underline-offset-2 hover:underline'
											>
												your collection
											</button>
											.
										</>
									) : (
										<>Finish every lesson to earn your certificate.</>
									)}
								</p>
							</div>
						)}
					</div>

					{/* Rate */}
					<button
						type='button'
						onClick={() => setReviewOpen(true)}
						className='hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-pill text-ink-secondary hover:text-clay-400 hover:bg-bg-overlay/40 transition-colors font-body text-xs'
					>
						<Star size={13} strokeWidth={1.75} />
						<span className='hidden lg:inline'>Rate</span>
					</button>

					{/* Share */}
					<button
						type='button'
						onClick={() => setShareOpen(true)}
						aria-label='Share'
						className='inline-grid place-items-center h-9 w-9 rounded-full text-ink-secondary hover:text-clay-400 hover:bg-bg-overlay/40 transition-colors'
					>
						<Share2 size={14} strokeWidth={1.75} />
					</button>
				</div>
			</div>

			{summary.total > 0 && (
				<div className='h-0.5 bg-line-subtle/40'>
					<div
						className={cn(
							'h-full transition-[width] duration-slow ease-out-quart',
							isCertified ? 'bg-signal-success' : 'bg-clay-500/80',
						)}
						style={{ width: `${percentage}%` }}
					/>
				</div>
			)}

			<ShareDialog
				open={shareOpen}
				onClose={() => setShareOpen(false)}
				url={`${config.urlPath}${location.pathname}`}
			/>
			<DialogShell
				open={reviewOpen}
				onClose={() => setReviewOpen(false)}
				label='Rate this course'
			>
				<ReviewCourse onCloseModal={() => setReviewOpen(false)} />
			</DialogShell>
		</header>
	);
};

export default LectureHeader;
