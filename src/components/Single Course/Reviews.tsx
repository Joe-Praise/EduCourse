import { useEffect } from 'react';
import RatingStarsContainer from '../shared/RatingStarsContainer';
import CommentCard from './CommentCard';
import { AppDispatch } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesReviewAction } from '../../redux/actions/reviewAction';
import { RootState } from '../../redux/reducers';
import { OmittedReviewDataType } from '../../redux/api/reviewApi';
import { SingleCourseType } from '../../redux/api/courseAPI';

interface Iprop {
	course: SingleCourseType;
}

const Review = (props: Iprop) => {
	const dispatch: AppDispatch = useDispatch();
	const reviews = useSelector((state: RootState) => state.review.review);
	const arr = Array.from(Array(4), () => 0);

	const { course } = props;
	useEffect(() => {
		dispatch(getCoursesReviewAction({ page: '1', limit: '3' }, course?._id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			<ul className='flex gap-2 justify-center mt-5'>
				{arr.map((_, i) => {
					return (
						<li
							key={i}
							className='w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white'
						>
							{i + 1}
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default Review;
