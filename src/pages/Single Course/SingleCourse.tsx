import { FC, useEffect } from 'react';
// import Comment from '../../components/shared/Comment';
import Curriculum from '../../components/Single Course/Curriculum';
import HeaderContainer from '../../components/Single Course/HeaderContainer';
import Instructor from '../../components/Single Course/Instructor';
import OverView from '../../components/Single Course/OverView';
import Reviews from '../../components/Single Course/Reviews';
import TabContainer from '../../components/Single Course/TabContainer';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleCourseAction } from '../../redux/actions/courseAction';

const SingleCourse: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const singleCourse = useSelector(
		(state: RootState) => state.course?.singleCourse
	);

	const { slug } = useParams();
	// const handleCourseComment = (commentText: string): void => {
	// 	console.log(commentText);
	// };

	console.log(singleCourse);

	useEffect(() => {
		dispatch(getSingleCourseAction(slug));
	}, [dispatch, slug]);

	return (
		<section>
			{singleCourse?.course?._id ? (
				<>
					<HeaderContainer {...singleCourse?.course} />
					<div className='layoutWidth flex mt-9'>
						<div className='mx-auto md:mx-0 basis-2/3'>
							<TabContainer
								children1={
									<OverView description={singleCourse?.course?.description} />
								}
								children2={<Curriculum modules={singleCourse?.modules} />}
								children3={
									<Instructor instructors={singleCourse?.course?.instructors} />
								}
								children4={<Reviews course={singleCourse?.course} />}
							/>
							{/* <div className='mt-4'>
								<Comment onCommentvalue={handleCourseComment} />
							</div> */}
						</div>
					</div>
				</>
			) : (
				<>Loading...</>
				// <div className='flex justify-center items-center h-screen'>
				// 	<div className='flex flex-row gap-2'>
				// 		<div className='w-4 h-4 rounded-full bg-blue-700 animate-bounce'></div>
				// 		<div className='w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]'></div>
				// 		<div className='w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]'></div>
				// 	</div>
				// </div>
			)}
		</section>
	);
};

export default SingleCourse;
