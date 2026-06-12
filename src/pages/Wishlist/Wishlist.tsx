import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HeartCrack, ArrowRight } from 'lucide-react';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import {
	getWishlistAction,
	removeFromWishlistAction,
} from '../../redux/actions/wishlistAction';
import {
	CourseCard,
	type CourseCardData,
	type CourseCardSize,
} from '../../features/course';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { ConfirmDialog } from '../../components/shared';

const sizeForIndex = (i: number): CourseCardSize => {
	if (i % 11 === 5) return 'feature';
	if (i % 7 === 3) return 'wide';
	return 'portrait';
};

const colSpanClass: Record<CourseCardSize, string> = {
	portrait: 'sm:col-span-3 lg:col-span-2',
	wide: 'sm:col-span-3 lg:col-span-3',
	feature: 'sm:col-span-6 lg:col-span-6',
};

interface PendingRemoval {
	wishlistId: string;
	courseId: string;
	title: string;
}

const Wishlist: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const initRef = useRef(true);
	const userId: string = useSelector((state: RootState) => state.user.userObj?._id) ?? '';
	const { items } = useSelector((state: RootState) => state.wishlist);

	const [pending, setPending] = useState<PendingRemoval | null>(null);

	useEffect(() => {
		if (initRef.current && userId) {
			initRef.current = false;
			dispatch(getWishlistAction(userId));
		}
	}, [dispatch, userId]);

	const confirmRemoval = () => {
		if (!pending) return;
		dispatch(removeFromWishlistAction(pending.wishlistId, pending.courseId));
		setPending(null);
	};

	return (
		<PageLayout width='default' className='pt-16 sm:pt-24 pb-32'>
			<header className='mb-12'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					{items.length} saved
				</span>
				<Reveal
					mode='word-split'
					as='h1'
					className='mt-3 font-display font-semibold text-5xl sm:text-6xl lg:text-7xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
				>
					Your collection.
				</Reveal>
				<p className='mt-6 max-w-xl font-body text-lg text-ink-secondary leading-[1.6]'>
					A curated room for courses you mean to come back to.
				</p>
			</header>

			{items.length === 0 ? (
				<div className='py-24 grid place-items-center text-center'>
					<div className='max-w-md'>
						<span className='inline-grid place-items-center h-16 w-16 rounded-full bg-bg-overlay text-ink-tertiary mx-auto'>
							<HeartCrack size={22} strokeWidth={1.5} />
						</span>
						<h3 className='mt-6 font-display font-semibold text-3xl text-ink-primary tracking-[-0.02em]'>
							Nothing in your collection yet.
						</h3>
						<p className='mt-2 font-body text-sm text-ink-tertiary'>
							Bookmark the courses you mean to take. They&apos;ll wait for you here.
						</p>
						<Link
							to='/courses'
							className='mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Browse the catalog
							<ArrowRight size={14} strokeWidth={2} />
						</Link>
					</div>
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-6 auto-rows-auto gap-6 sm:gap-8'>
					{items.map((item, idx) => {
						const course = (item.courseId ?? item) as unknown as CourseCardData & { _id: string };
						const size = sizeForIndex(idx);
						return (
							<div key={item._id} className={colSpanClass[size]}>
								<CourseCard
									course={course}
									size={size}
									wishlisted
									onToggleWishlist={() =>
										setPending({
											wishlistId: item._id,
											courseId: course._id,
											title: course.title,
										})
									}
								/>
							</div>
						);
					})}
				</div>
			)}

			<ConfirmDialog
				open={pending !== null}
				title='Remove from your collection?'
				message={
					pending
						? `"${pending.title}" will be removed from your wishlist. You can add it back anytime.`
						: undefined
				}
				confirmLabel='Remove'
				cancelLabel='Keep it'
				tone='danger'
				onConfirm={confirmRemoval}
				onCancel={() => setPending(null)}
			/>
		</PageLayout>
	);
};

export default Wishlist;
