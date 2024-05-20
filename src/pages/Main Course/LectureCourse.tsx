import { FC, useEffect, useState } from 'react';
import VideoSection from '../../components/Lecture Course/VideoSection';
import LayoutFooter from '../../widgets/LayoutFooter/LayoutFooter';
import { IoClose } from 'react-icons/io5';
import {
	RenderIf,
	Accordion,
	LoadingEffect,
	TabContainer,
} from '../../components/shared';
import { FaArrowLeft } from 'react-icons/fa';
import LectureHeader from '../../components/Lecture Course/LectureHeader';
import OverView from '../../components/Single Course/OverView';
import Curriculum from '../../components/Single Course/Curriculum';
import Instructor from '../../components/Single Course/Instructor';
import Review from '../../components/Single Course/Reviews';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	ModuleType,
	getLectureCourseAction,
	lectureCourseType,
} from '../../redux/actions/courseAction';
import { getLocalStorage } from '../../util/helperFunctions/helper';

type tabheaderType = {
	CourseContent: string | undefined;
	Overview: string;
	Instructor: string;
	Reviews: string;
};

const LectureCourse: FC = () => {
	const { slug, courseId } = useParams<{ courseId: string; slug: string }>();
	const [activeView, setActiveView] = useState<string>('Overview');

	// ensuring courseId is always a string
	const courseIdString: string = courseId || '';
	const slugString: string = slug || '';
	const dispatch: AppDispatch = useDispatch();
	const lectureCourse = useSelector(
		(state: RootState) => state.course.lectureCourse
	);

	// const review = useSelector((state: RootState) => state.review.review);

	useEffect(() => {
		const details: lectureCourseType = {
			courseId: courseIdString,
			userId: getLocalStorage('profile')?.user?._id,
		};
		const handleGetLecture = () => {
			dispatch(getLectureCourseAction(details));
		};
		handleGetLecture();
	}, [dispatch, courseIdString]);

	const [handleReposition, setHandleReposition] = useState(false);

	const [windowSize, setWindowSize] = useState([
		window.innerWidth,
		window.innerHeight,
	]);

	useEffect(() => {
		const handleWindowResize = () => {
			setWindowSize([window.innerWidth, window.innerHeight]);
		};

		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, []);

	const stickyNavbar = () => {
		if (window.scrollY >= 45) setHandleReposition(true);
		else setHandleReposition(false);
	};

	window.addEventListener('scroll', stickyNavbar);

	const [hideCourseContent, setCourseContent] = useState(false);

	const handleHideCourseContent = () => {
		setCourseContent((prevState) => !prevState);
	};

	// setting the expected headers for the tabs
	const tabHeader: tabheaderType = {
		// this hides the course content when on desktop || course content(sidebar) is hidden
		CourseContent:
			hideCourseContent || windowSize[0] < 900 ? 'Course Content' : undefined,
		Overview: 'Overview',
		Instructor: 'Instructor',
		Reviews: 'Reviews',
	};

	// switch the detail rendered content
	let display;

	switch (activeView) {
		case 'Course Content':
			// checks if course content is hidden and gives focus to overview
			if (tabHeader.CourseContent === undefined) {
				setActiveView('Overview');
				display = <OverView description={lectureCourse?.course?.description} />;
			} else {
				display = <Curriculum modules={lectureCourse?.modules} />;
			}
			break;
		case 'Overview':
			display = <OverView description={lectureCourse?.course?.description} />;
			break;
		case 'Instructor':
			display = <Instructor instructors={lectureCourse?.course?.instructors} />;
			break;
		case 'Reviews':
			display = <Review course={lectureCourse?.course} />;
			break;
		default:
			display = <OverView description={lectureCourse?.course?.description} />;
	}

	return (
		<section className=''>
			{/* LECTURE HEADER PAGE COMPONENT */}
			<LectureHeader onWindowSize={windowSize[0]} courseTitle={slugString} />

			{lectureCourse?.course?._id ? (
				<div className='flex relative overflow-hidden '>
					{/* LEFT HAND SIDE OF THE PAGE THAT CONTAINS THE VIDEO, TABS AND FOOTER */}
					<div
						className={`min-h-screen  lg:basis-9/12 bg-gray-50 ${
							hideCourseContent ? 'flex-1 transition-all' : ''
						} `}
					>
						<VideoSection />
						{/* <LectureTabContainer
							children1={<Curriculum modules={lectureCourse?.modules} />}
							children2={
								<OverView description={lectureCourse?.course?.description} />
							}
							children3={
								<Instructor instructors={lectureCourse?.course?.instructors} />
							}
							children4={<Review course={lectureCourse?.course} />}
							isHideCourseContent={hideCourseContent}
							onWindowSize={windowSize[0]}
						/>
					*/}

						<TabContainer
							lecture
							buttons={
								<>
									{Object.entries(tabHeader).map(([, value], i) => {
										return (
											<li
												key={i}
												className={`p-2 py-5 cursor-pointer flex justify-center items-center text-sm font-semibold ${
													activeView === value ? 'text-effect-active' : ''
												}`}
												onClick={() => setActiveView(value || '')}
											>
												{value}
											</li>
										);
									})}
								</>
							}
						>
							{display}
						</TabContainer>
						<LayoutFooter />
					</div>
					{/* ENDS HERE; */}

					{/* RIGHT HAND SECTION THAT HOLD S THE CONTENT MODULES */}
					<div
						className={`hidden lg:block min-h-screen max-h-screen overflow-auto md:fixed w-[25%] bg-white right-0 transition-all  ${
							hideCourseContent ? 'translate-x-96' : ''
						} ${handleReposition ? 'top-0' : ''}`}
					>
						<div className='flex items-center justify-between p-3 border'>
							<h2>Course content</h2>
							<span
								onClick={handleHideCourseContent}
								className='cursor-pointer'
							>
								<button>
									<IoClose className='h-6 w-6' />
								</button>
							</span>
						</div>
						<div className=''>
							{lectureCourse?.modules.map((el: ModuleType) => {
								return <Accordion content={el} key={el._id} />;
							})}
						</div>
					</div>
					{/* ENDS HERE */}

					{/* the popup button that shows when menu is closed */}
					<RenderIf condition={hideCourseContent}>
						<button
							className='hidden lg:flex p-4 border absolute -right-28 top-52 bg-black text-white cursor-pointer items-center gap-4 transition-all duration-200 hover:right-0'
							onClick={handleHideCourseContent}
						>
							<FaArrowLeft />
							<p>Course content</p>
						</button>
					</RenderIf>
				</div>
			) : (
				<LoadingEffect />
			)}
		</section>
	);
};

export default LectureCourse;
