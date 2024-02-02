import { FC, useEffect, useState } from 'react';
import VideoSection from '../../components/Lecture Course/VideoSection';
import LayoutFooter from '../../widgets/LayoutFooter/LayoutFooter';
import { IoClose } from 'react-icons/io5';
import Accordion from '../../components/shared/Accordion';
import { accordionType } from '../Courses/courseType';
import RenderIf from '../../components/shared/RenderIf';
import { FaArrowLeft } from 'react-icons/fa';
import LectureHeader from '../../components/Lecture Course/LectureHeader';
import OverView from '../../components/Single Course/OverView';
import Curriculum from '../../components/Single Course/Curriculum';
import Instructor from '../../components/Single Course/Instructor';
import Review from '../../components/Single Course/Reviews';
import LectureTabContainer from '../../components/Lecture Course/LectureTabContainer';

const LectureCourse: FC = () => {
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
	const dropDown1: accordionType[] = [
		{
			title: 'Module 1',
			items: [
				{
					title: 'lesson 2',
					duration: '10:01',
					lessonIndex: '2',
				},
				{
					title: 'lesson 3',
					duration: '5:01',
					lessonIndex: '3',
				},
				{
					title: 'lesson 1',
					duration: '15:01',
					lessonIndex: '1',
				},
			],
		},
		{
			title: 'Module 2',
			items: [
				{
					title: 'lesson 2',
					duration: '10:01',
					lessonIndex: '2',
				},
				{
					title: 'lesson 3',
					duration: '5:01',
					lessonIndex: '3',
				},
				{
					title: 'lesson 1',
					duration: '15:01',
					lessonIndex: '1',
				},
			],
		},
		{
			title: 'Module 3',
			items: [
				{
					title: 'lesson 2',
					duration: '10:01',
					lessonIndex: '2',
				},
				{
					title: 'lesson 3',
					duration: '5:01',
					lessonIndex: '3',
				},
				{
					title: 'lesson 1',
					duration: '15:01',
					lessonIndex: '1',
				},
			],
		},
		{
			title: 'Module 4',
			items: [
				{
					title: 'lesson 2',
					duration: '10:01',
					lessonIndex: '2',
				},
				{
					title: 'lesson 3',
					duration: '5:01',
					lessonIndex: '3',
				},
				{
					title: 'lesson 1',
					duration: '15:01',
					lessonIndex: '1',
				},
			],
		},
	];
	return (
		<section className=''>
			{/* LECTURE HEADER PAGE COMPONENT */}
			<LectureHeader onWindowSize={windowSize[0]} />

			<div className='flex relative overflow-hidden '>
				<div
					className={`min-h-screen  lg:basis-9/12 bg-gray-50 ${
						hideCourseContent ? 'flex-1 transition-all' : ''
					} `}
				>
					<VideoSection />
					<LectureTabContainer
						children1={<Curriculum />}
						children2={<OverView />}
						children3={<Instructor />}
						children4={<Review />}
						isHideCourseContent={hideCourseContent}
						onWindowSize={windowSize[0]}
					/>
					<LayoutFooter />
				</div>
				<div
					className={`hidden lg:block min-h-screen max-h-screen overflow-auto md:fixed w-[25%] bg-white right-0 transition-all  ${
						hideCourseContent ? 'translate-x-96' : ''
					} ${handleReposition ? 'top-0' : ''}`}
				>
					<div className='flex items-center justify-between p-3 border'>
						<h2>Course content</h2>
						<span onClick={handleHideCourseContent} className='cursor-pointer'>
							<button>
								<IoClose className='h-6 w-6' />
							</button>
						</span>
					</div>
					<div className=''>
						{dropDown1.map((el, idx) => {
							return <Accordion content={el} key={idx} />;
						})}
					</div>
				</div>
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
		</section>
	);
};

export default LectureCourse;
