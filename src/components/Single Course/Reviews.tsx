import { useEffect } from 'react';
import RatingStarsContainer from '../shared/RatingStarsContainer';
import CommentCard from './CommentCard';
import { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesReviewAction } from '../../redux/actions/reviewAction';
import { RootState } from '../../redux/reducers';
import { OmittedReviewDataType } from '../../redux/api/reviewApi';
import { SingleCourseType } from '../../redux/api/courseAPI';
import Pagination from '../shared/Pagination';
import { paginateType } from '../../redux/sharedTypes';

interface Iprop {
	course: SingleCourseType;
}

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

	return (
		<section>
			<h1>Students Feedback</h1>
			<RatingStarsContainer
				rating={course?.ratingsAverage + ''}
				percentage={course?.ratingSummary}
			/>
			{reviews?.data?.map((el: OmittedReviewDataType) => {
				return <CommentCard key={el._id} {...el} />;
			})}

			<Pagination
				handlePagination={handleReviewPaginationDispatch}
				metaData={metaData}
				queryString={''}
			/>
		</section>
	);
};

export default Review;
