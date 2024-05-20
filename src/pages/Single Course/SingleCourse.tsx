import { FC, useEffect, useState } from 'react';
import {
	Curriculum,
	HeaderContainer,
	Instructor,
	OverView,
	Reviews,
} from '../../components/Single Course';
import { LoadingEffect, TabContainer } from '../../components/shared';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleCourseAction } from '../../redux/actions/courseAction';

type tabheaderType = {
	Overview: string;
	Curriculum: string;
	Instructor: string;
	Reviews: string;
};

const SingleCourse: FC = () => {
	const [activeView, setActiveView] = useState<string>('Overview');
	const dispatch: AppDispatch = useDispatch();
	const singleCourse = useSelector(
		(state: RootState) => state.course?.singleCourse
	);

	const { slug } = useParams();

	useEffect(() => {
		dispatch(getSingleCourseAction(slug));
	}, [dispatch, slug]);

	// // setting the expected headers for the tabs
	const tabHeader: tabheaderType = {
		Overview: 'Overview',
		Curriculum: 'Curriculum',
		Instructor: 'Instructor',
		Reviews: 'Reviews',
	};

	// switch the detail rendered content
	let display;

	switch (activeView) {
		case 'Overview':
			display = <OverView description={singleCourse?.course?.description} />;
			break;
		case 'Curriculum':
			display = <Curriculum modules={singleCourse?.modules} />;
			break;
		case 'Instructor':
			display = <Instructor instructors={singleCourse?.course?.instructors} />;
			break;
		case 'Reviews':
			display = <Reviews course={singleCourse?.course} />;
			break;
		default:
			display = <OverView description={singleCourse?.course?.description} />;
	}

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
								buttons={
									<>
										{Object.entries(tabHeader).map(([key, value], i, arr) => (
											<li
												key={`{${i}}_tabheaders`}
												className={`p-2 basis-1/4 border cursor-pointer flex justify-center items-center ${
													activeView === key
														? 'bg-effect-active text-white'
														: ''
												} ${i === 0 ? 'rounded-tl-md' : ''} ${
													i === arr.length - 1 ? 'rounded-tr-md' : ''
												}`}
												onClick={() => setActiveView(value)}
											>
												{value}
											</li>
										))}
									</>
								}
							>
								{display}
							</TabContainer>
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
