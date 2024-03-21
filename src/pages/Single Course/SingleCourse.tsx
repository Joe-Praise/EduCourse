import { FC, useEffect } from 'react';
import {
	Curriculum,
	HeaderContainer,
	Instructor,
	OverView,
	Reviews,
	TabContainer,
} from '../../components/Single Course';
import { LoadingEffect } from '../../components/shared';
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

	useEffect(() => {
		dispatch(getSingleCourseAction(slug));
	}, [dispatch, slug]);

	return (
		<section>
			{singleCourse?.course?._id ? (
				<>
					<HeaderContainer
						{...singleCourse?.course}
						course={singleCourse?.course}
						isEnrolled={singleCourse?.isEnrolled}
					/>
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
						</div>
					</div>
				</>
			) : (
				<LoadingEffect />
			)}
		</section>
	);
};

export default SingleCourse;
