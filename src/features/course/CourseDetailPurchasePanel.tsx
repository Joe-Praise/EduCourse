import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Check, Clock3, BookOpen, Award, Smartphone } from 'lucide-react';
import { Surface, Button, Text } from '../../ui';
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
	totalLessons?: number;
	duration?: string;
}

interface CourseDetailPurchasePanelProps {
	course: CoursePanelInput;
	isEnrolled: boolean;
	wishlisted?: boolean;
	onToggleWishlist?: () => void;
	variant?: 'panel' | 'bottom-bar';
	className?: string;
}

const includes: Array<{ icon: typeof Check; label: string }> = [
	{ icon: Clock3, label: 'Lifetime access' },
	{ icon: Award, label: 'Certificate of completion' },
	{ icon: BookOpen, label: 'Downloadable resources' },
	{ icon: Smartphone, label: 'Mobile + desktop access' },
];

export function CourseDetailPurchasePanel({
	course,
	isEnrolled,
	wishlisted = false,
	onToggleWishlist,
	variant = 'panel',
	className,
}: CourseDetailPurchasePanelProps) {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector((state: RootState) => state.user.userObj?._id);
	const { enrolled, isChecking, isEnrolling } = useSelector(
		(state: RootState) => state.enrollment,
	);

	const actuallyEnrolled = isEnrolled || enrolled;
	const isFree = course.priceCategory?.toLowerCase() === 'free' || course.price === 0;
	const hasDiscount =
		typeof course.priceDiscount === 'number' &&
		course.priceDiscount > 0 &&
		course.priceDiscount < course.price;
	const displayPrice = hasDiscount ? course.priceDiscount! : course.price;

	useEffect(() => {
		if (userId && course._id && !isEnrolled && !enrolled) {
			dispatch(checkEnrollmentAction(userId, course._id));
		}
	}, [dispatch, userId, course._id, isEnrolled, enrolled]);

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

	const ctaLabel = actuallyEnrolled
		? 'Go to course'
		: isEnrolling
			? 'Processing…'
			: isFree
				? 'Enroll free'
				: `Buy · $${formatAmount(displayPrice)}`;

	if (variant === 'bottom-bar') {
		return (
			<div
				className={cn(
					'fixed inset-x-0 bottom-0 z-30 lg:hidden',
					'border-t border-line-base bg-bg-raised/95 backdrop-blur-md',
					'px-4 py-3 flex items-center justify-between gap-3',
					className,
				)}
			>
				<div className='flex flex-col leading-none'>
					{hasDiscount && !isFree && (
						<Text variant='body-2xs' tone='muted' className='line-through tabular-nums'>
							${formatAmount(course.price)}
						</Text>
					)}
					<Text
						variant='display-sm'
						tone={isFree ? 'success' : 'primary'}
						className='tabular-nums leading-none'
					>
						{isFree ? 'Free' : `$${formatAmount(displayPrice)}`}
					</Text>
				</div>
				<Button
					variant='primary'
					size='md'
					loading={isEnrolling || isChecking}
					onClick={handlePrimary}
				>
					{ctaLabel}
				</Button>
			</div>
		);
	}

	return (
		<Surface level='raised' className={cn('overflow-hidden flex flex-col', className)}>
			<div className='aspect-[16/10] relative overflow-hidden'>
				<img
					src={imgSrc(course.imageCover, '/course/', TRANSFORMS.courseCoverCard)}
					alt=''
					loading='lazy'
					decoding='async'
					className='absolute inset-0 h-full w-full object-cover'
				/>
				<div className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-raised to-transparent' />
			</div>
			<div className='flex flex-col gap-4 px-5 py-5'>
				<div className='flex items-end gap-2'>
					{hasDiscount && !isFree && (
						<Text variant='body-sm' tone='muted' className='line-through tabular-nums'>
							${formatAmount(course.price)}
						</Text>
					)}
					<Text
						variant='display-lg'
						tone={isFree ? 'success' : 'primary'}
						className='tabular-nums leading-none'
					>
						{isFree ? 'Free' : `$${formatAmount(displayPrice)}`}
					</Text>
				</div>

				<div className='flex items-stretch gap-2'>
					<Button
						variant='primary'
						size='lg'
						fullWidth
						loading={isEnrolling || isChecking}
						onClick={handlePrimary}
					>
						{ctaLabel}
					</Button>
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
							<li
								key={item.label}
								className='flex items-center gap-2.5 text-ink-secondary'
							>
								<Icon size={14} strokeWidth={2} className='text-brand-400' />
								<Text variant='body-sm' tone='inherit'>
									{item.label}
								</Text>
							</li>
						);
					})}
				</ul>
			</div>
		</Surface>
	);
}
