import { useMemo, useState } from 'react';
import { Star, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/reducers';
import { createCourseReviewAction } from '../../redux/actions/reviewAction';
import { cn } from '../../lib/cn';

interface ReviewCourseProps {
	onCloseModal: () => void;
}

const RATING_LABELS: Record<number, string> = {
	1: 'Disappointing',
	2: 'Below expectations',
	3: 'It was fine',
	4: 'Genuinely good',
	5: 'Exceptional',
};

const ReviewCourse = ({ onCloseModal }: ReviewCourseProps) => {
	const dispatch: AppDispatch = useDispatch();
	const courseId = useSelector(
		(state: RootState) => state.course?.lectureCourse?.course?._id,
	);
	const userName = useSelector((state: RootState) => state.user.userObj?.name) ?? '';

	const [rating, setRating] = useState<number>(0);
	const [hoverRating, setHoverRating] = useState<number>(0);
	const [text, setText] = useState<string>('');
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [done, setDone] = useState<boolean>(false);

	const displayRating = hoverRating || rating;
	const ratingLabel = useMemo(() => RATING_LABELS[displayRating] ?? ' ', [displayRating]);

	const canSubmit = rating > 0 && !submitting;

	const handleSubmit = async () => {
		if (!canSubmit) return;
		setSubmitting(true);
		try {
			await dispatch(createCourseReviewAction({ rating, review: text.trim() }, courseId));
			setDone(true);
			window.setTimeout(() => {
				onCloseModal();
				setText('');
				setRating(0);
				setDone(false);
			}, 1400);
		} finally {
			setSubmitting(false);
		}
	};

	if (done) {
		return (
			<div className='flex flex-col items-center text-center py-10 gap-4'>
				<span className='inline-grid place-items-center h-14 w-14 rounded-full bg-signal-success/20 text-signal-success'>
					<Check size={22} strokeWidth={2} />
				</span>
				<h3
					className='font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
					style={{ fontVariationSettings: '"opsz" 32' }}
				>
					Thank you{userName ? `, ${userName.split(' ')[0]}` : ''}.
				</h3>
				<p className='font-body text-sm text-ink-secondary'>
					Your rating helps other learners find the right course.
				</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6'>
			<header className='text-center'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					Your review
				</span>
				<h2
					className='mt-2 font-display font-semibold text-2xl sm:text-3xl text-ink-primary tracking-[-0.02em]'
					style={{ fontVariationSettings: '"opsz" 48' }}
				>
					What did you think?
				</h2>
			</header>

			{/* Star picker */}
			<div className='flex flex-col items-center gap-3'>
				<div
					className='flex items-center gap-1'
					onMouseLeave={() => setHoverRating(0)}
				>
					{[1, 2, 3, 4, 5].map((n) => {
						const filled = n <= displayRating;
						return (
							<button
								key={n}
								type='button'
								onClick={() => setRating(n === rating ? 0 : n)}
								onMouseEnter={() => setHoverRating(n)}
								aria-label={`${n} star${n === 1 ? '' : 's'}`}
								className={cn(
									'inline-grid place-items-center h-10 w-10 rounded-full transition-[transform,color] duration-base ease-out-quart',
									'focus-visible:outline-none focus-visible:shadow-focus-ring',
									'hover:scale-[1.15] active:scale-95',
								)}
							>
								<Star
									size={26}
									strokeWidth={1.5}
									className={cn(
										'transition-colors',
										filled ? 'text-clay-500 fill-clay-500' : 'text-line-strong',
									)}
								/>
							</button>
						);
					})}
				</div>
				<span
					className={cn(
						'font-mono text-2xs uppercase tracking-[0.22em] transition-colors',
						displayRating > 0 ? 'text-clay-400' : 'text-ink-tertiary',
					)}
				>
					{ratingLabel}
				</span>
			</div>

			{/* Comment */}
			<div className='flex flex-col gap-1.5'>
				<label
					htmlFor='review-text'
					className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'
				>
					Your thoughts (optional)
				</label>
				<textarea
					id='review-text'
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder='What worked? What would you change?'
					rows={4}
					className='w-full rounded-card border border-line-base bg-bg-overlay/40 px-3.5 py-3 font-body text-sm text-ink-primary placeholder-ink-tertiary outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-colors resize-none'
				/>
			</div>

			{/* Actions */}
			<div className='flex items-center justify-end gap-2'>
				<button
					type='button'
					onClick={onCloseModal}
					className='inline-flex items-center h-10 px-4 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body text-sm transition-colors'
				>
					Cancel
				</button>
				<button
					type='button'
					onClick={handleSubmit}
					disabled={!canSubmit}
					className={cn(
						'inline-flex items-center h-10 px-5 rounded-pill font-body font-medium text-sm transition-[background-color,opacity]',
						canSubmit
							? 'bg-clay-500 hover:bg-clay-600 text-white'
							: 'bg-bg-overlay text-ink-tertiary cursor-not-allowed',
					)}
				>
					{submitting ? 'Submitting…' : 'Submit review'}
				</button>
			</div>
		</div>
	);
};

export default ReviewCourse;
