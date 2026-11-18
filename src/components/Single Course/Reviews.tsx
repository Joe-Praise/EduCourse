import { useEffect } from 'react';
import CommentCard from './CommentCard';
import { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesReviewAction } from '../../redux/actions/reviewAction';
import { RootState } from '../../redux/reducers';
import { OmittedReviewDataType } from '../../redux/api/reviewApi';
import { SingleCourseType } from '../../redux/api/courseAPI';
import Pagination from '../shared/Pagination';
import { paginateType } from '../../redux/sharedTypes';
import { RatingDistributionBar } from '../../features/course';

interface Iprop {
	course: SingleCourseType;
}

/**
 * A course's rating summary and written reviews. The single place both are
 * rendered — used by the course page and the lesson player's Reviews tab.
 */
const Review = (props: Iprop) => {
	const dispatch: AppDispatch = useDispatch();
	const reviews = useSelector((state: RootState) => state.review.review);
	const limit = '6';
	const metaData = reviews.metaData;

	const { course } = props;
	useEffect(() => {
		dispatch(getCoursesReviewAction({ page: '1', limit }, course?._id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	// handles Pagination dispatch
	const handleReviewPaginationDispatch = (details: paginateType) => {
		dispatch(getCoursesReviewAction(details, course?._id));
	};

	// The backend defaults ratingsAverage to 4.5 for a course nobody has rated,
	// so the count, not the average, decides whether there is anything to show.
	const ratingCount = course?.ratingsQuantity ?? 0;

	return (
		<div className='flex flex-col gap-6'>
			{ratingCount > 0 ? (
				<RatingDistributionBar
					average={course.ratingsAverage ?? 0}
					totalCount={ratingCount}
					buckets={course.ratingSummary?.map((s) => ({
						stars: Number(s.title),
						percent: s.value,
					}))}
					className='mb-6'
				/>
			) : (
				<p className='font-body text-sm text-ink-secondary'>No ratings yet.</p>
			)}

			{reviews?.data?.map((el: OmittedReviewDataType) => {
				return <CommentCard key={el._id} {...el} />;
			})}

			{metaData?.totalPages > 1 && (
				<Pagination
					handlePagination={handleReviewPaginationDispatch}
					metaData={metaData}
					queryString={''}
				/>
			)}
		</div>
	);
};

export default Review;
