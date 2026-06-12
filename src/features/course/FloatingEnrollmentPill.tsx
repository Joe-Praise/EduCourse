import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, Check, Clock3, BookOpen, Award, Smartphone } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';
import { WishlistToggle } from './WishlistToggle';
import { AppDispatch, RootState } from '../../redux/store';
import {
	checkEnrollmentAction,
	createEnrollmentAction,
} from '../../redux/actions/enrollmentAction';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { formatAmount } from '../../util/helperFunctions/helper';
import { cn } from '../../lib/cn';

interface CoursePanelInput {
	_id: string;
	slug: string;
	title: string;
	imageCover: string;
	price: number;
	priceCategory?: string;
	priceDiscount?: number;
}

interface FloatingEnrollmentPillProps {
	course: CoursePanelInput;
	isEnrolled: boolean;
	wishlisted?: boolean;
	onToggleWishlist?: () => void;
}

const includes = [
	{ icon: Clock3, label: 'Lifetime access' },
	{ icon: Award, label: 'Certificate of completion' },
	{ icon: BookOpen, label: 'Downloadable resources' },
	{ icon: Smartphone, label: 'Mobile + desktop' },
];

export function FloatingEnrollmentPill({
	course,
	isEnrolled,
	wishlisted = false,
	onToggleWishlist,
}: FloatingEnrollmentPillProps) {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector((state: RootState) => state.user.userObj?._id);
	const { enrolled, isChecking, isEnrolling } = useSelector(
		(state: RootState) => state.enrollment,
	);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [render, setRender] = useState<boolean>(false);
	const rootRef = useRef<HTMLDivElement>(null);

	// Guard against setRender(false) firing in GSAP's onComplete after the
	// component has unmounted (route change mid-close-animation). Prevents
	// removeChild errors in the React reconciler.
	const mountedRef = useRef<boolean>(true);
	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const actuallyEnrolled = isEnrolled || enrolled;
	const isFree = course.priceCategory?.toLowerCase() === 'free' || course.price === 0;
	const hasDiscount =
		typeof course.priceDiscount === 'number' &&
		course.priceDiscount > 0 &&
		course.priceDiscount < course.price;
	const displayPrice = hasDiscount ? course.priceDiscount! : course.price;

	useEffect(() => {
		if (userId && course._id && !isEnrolled) {
			dispatch(checkEnrollmentAction(userId, course._id));
		}
	}, [dispatch, userId, course._id, isEnrolled]);

	useEffect(() => {
		if (expanded) setRender(true);
	}, [expanded]);

	useGSAP(
		() => {
			if (!render) return;
			const root = rootRef.current;
			if (!root) return;
			const panel = root.querySelector<HTMLElement>('[data-pill-panel]');
			const backdrop = root.querySelector<HTMLElement>('[data-pill-backdrop]');
			if (!panel) return;
			if (prefersReducedMotion()) {
				gsap.set(panel, { opacity: 1, y: 0 });
				if (backdrop) gsap.set(backdrop, { opacity: 1 });
				return;
			}
			if (expanded) {
				if (backdrop) gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2 });
				gsap.fromTo(
					panel,
					{ y: 24, opacity: 0, scale: 0.96 },
					{ y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' },
				);
			} else {
				if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.16 });
				gsap.to(panel, {
					y: 18,
					opacity: 0,
					scale: 0.96,
					duration: 0.22,
					ease: 'power2.in',
					onComplete: () => {
						if (mountedRef.current) setRender(false);
					},
				});
			}
		},
		{ scope: rootRef, dependencies: [expanded, render] },
	);

	const handlePrimary = () => {
		if (actuallyEnrolled) {
			navigate(`/courses/${course.slug}/lecture/${course._id}`);
			return;
		}
		if (!userId) {
			navigate('/signin');
			return;
		}
		dispatch(
			createEnrollmentAction({ userId, courseId: course._id }, navigate, course.slug, course._id),
		);
	};

	const ctaShort = actuallyEnrolled
		? 'Continue'
		: isFree
			? 'Enroll'
			: `$${formatAmount(displayPrice)}`;
	const ctaLong = actuallyEnrolled
		? 'Continue learning'
		: isEnrolling
			? 'Processing…'
			: isFree
				? 'Enroll free'
				: `Enroll · $${formatAmount(displayPrice)}`;

	return (
		<>
			{/* Collapsed pill */}
			<div className='absolute right-4 bottom-4 sm:right-6 sm:bottom-6 z-40'>
				<Magnetic strength={0.2}>
					<button
						type='button'
						onClick={() => setExpanded(true)}
						data-cursor='grow'
						aria-label={`Open enrollment panel · ${course.title}`}
						className='inline-flex items-center gap-3 h-14 pl-5 pr-2 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary shadow-clay font-body font-medium text-sm transition-colors'
					>
						<span>{ctaShort}</span>
						<span className='inline-grid place-items-center h-10 w-10 rounded-full bg-ink-primary text-bg-base'>
							<ArrowRight size={16} strokeWidth={2.5} />
						</span>
					</button>
				</Magnetic>
			</div>

			{/* Expanded panel — portalled to document.body so Lenis transforms
			    don't break position:fixed (a transformed ancestor makes fixed
			    position relative to the container, not the viewport). */}
			{render && createPortal(
				<div
					ref={rootRef}
					className='fixed inset-0 z-50 grid place-items-end sm:place-items-center p-4 sm:p-6'
					role='dialog'
					aria-modal='true'
				>
					<div
						data-pill-backdrop
						onClick={() => setExpanded(false)}
						className='absolute inset-0 bg-black/70 backdrop-blur-sm'
					/>
					<div
						data-pill-panel
						className='relative w-full max-w-md rounded-card overflow-hidden bg-bg-raised shadow-warm-3'
					>
						<div className='aspect-[16/9] relative overflow-hidden'>
							<img
								src={imgSrc(course.imageCover, '/course/', TRANSFORMS.courseCoverCard)}
								alt=''
								className='absolute inset-0 h-full w-full object-cover'
							/>
							<div className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-raised to-transparent' />
							<button
								type='button'
								onClick={() => setExpanded(false)}
								aria-label='Close'
								className='absolute right-3 top-3 inline-grid place-items-center h-9 w-9 rounded-full bg-bg-overlay/85 backdrop-blur text-ink-secondary hover:text-ink-primary transition-colors'
							>
								<X size={14} strokeWidth={2} />
							</button>
						</div>

						<div className='px-6 py-6 flex flex-col gap-5'>
							<div>
								<h3
									className='font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em] leading-[1.2]'
									style={{ fontVariationSettings: '"opsz" 32' }}
								>
									{course.title}
								</h3>
								<div className='mt-3 flex items-end gap-2'>
									{hasDiscount && !isFree && (
										<span className='font-body text-sm text-ink-muted line-through tabular-nums'>
											${formatAmount(course.price)}
										</span>
									)}
									<span
										className={cn(
											'font-display font-semibold text-4xl tabular-nums leading-none',
											isFree ? 'text-signal-success' : 'text-ink-primary',
										)}
										style={{ fontVariationSettings: '"opsz" 96' }}
									>
										{isFree ? 'Free' : `$${formatAmount(displayPrice)}`}
									</span>
								</div>
							</div>

							<div className='flex items-stretch gap-2'>
								<button
									type='button'
									onClick={handlePrimary}
									disabled={isEnrolling || isChecking}
									className='flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors disabled:opacity-50'
								>
									{ctaLong}
								</button>
								{onToggleWishlist && (
									<WishlistToggle
										active={wishlisted}
										onToggle={onToggleWishlist}
										label={course.title}
										size='md'
									/>
								)}
							</div>

							<ul className='flex flex-col gap-2 pt-2 border-t border-line-subtle'>
								{includes.map((item) => {
									const Icon = item.icon;
									return (
										<li key={item.label} className='flex items-center gap-2.5 text-ink-secondary'>
											<Check size={14} strokeWidth={2} className='text-clay-400 shrink-0' />
											<Icon size={13} strokeWidth={1.75} className='text-ink-tertiary' />
											<span className='font-body text-sm'>{item.label}</span>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
				, document.body)}
		</>
	);
}
