import { Circle } from 'rc-progress';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoIosArrowDown } from 'react-icons/io';
import { LiaTrophySolid } from 'react-icons/lia';
import Logo from '../shared/Logo';
import LinkBtn from '../shared/LinkBtn';
import RenderIf from '../shared/RenderIf';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosReturnLeft } from 'react-icons/io';
import useHandleModal from '../../hooks/UseHandleModal';
import { ModalRef } from '../../pages/Main Course/LectureType';
import { FaStar } from 'react-icons/fa6';
import Modal from '../shared/Modal';
import { useEffect, useRef, useState } from 'react';
import CopyText from '../shared/CopyText';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import ReviewCourse from './ReviewCourse';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { ModuleType } from '../../redux/actions/courseAction';
import config from '../../../config';

interface Iprop {
	onWindowSize: number;
	courseTitle: string;
}

interface summary {
	total: number;
	completed: number;
}
const LectureHeader = (props: Iprop) => {
	const navigate = useNavigate();
	const location = useLocation();
	const shareRef = useRef<ModalRef>(null);
	const reviewRef = useRef<ModalRef>(null);
	const lectureCourse = useSelector(
		(state: RootState) => state.course.lectureCourse
	);
	const modules = lectureCourse?.modules;
	const { onWindowSize, courseTitle } = props;
	const isTabView = onWindowSize > 600;
	const isDesktopView = onWindowSize > 1000;
	const {
		modal: toggleDropdown,
		handleModal: handleToggleDropdown,
		// closeModal: closeDropdown,
	} = useHandleModal();
	const [lessonSummary, setLessonSummary] = useState<summary>({
		total: 0,
		completed: 0,
	});

	/**
	 * TODO:Build the archive and favourite course list and functionalities
	 */

	const handleShowModal = () => {
		shareRef.current!.open();
	};

	const handleReviewModal = () => {
		reviewRef.current!.open();
	};

	const handleCloseReviewModal = () => {
		reviewRef.current!.close();
	};

	// TODO: handle the summary from the backend
	useEffect(() => {
		if (modules?.length > 0) {
			const TotalNoOfModules = (modules: ModuleType[]) => {
				const summary = modules.flatMap((el) => el.lessons);
				setLessonSummary({
					total: summary?.length,
					completed: Math.round(summary?.length / 2),
				});
			};
			TotalNoOfModules(modules);
		}
	}, [modules]);

	const percentage = (lessonSummary?.completed / lessonSummary?.total) * 100;

	return (
		<header className='flex items-center justify-between h-14 bg-white px-4 rounded-lg shadow-md p-3'>
			<RenderIf condition={!isTabView}>
				<ul className='flex items-center gap-5 lg:gap-20 flex-1 '>
					<li className='m-0 p-0'>
						<button onClick={() => navigate(-1)} className=''>
							<IoIosReturnLeft className='w-12 h-8' />
						</button>
					</li>

					<li className='mb-2'>
						<LinkBtn
							className={'border-none text-sm font-bold text-black'}
							value={capitalizeFirstLetters(courseTitle)}
							path={`/courses/${courseTitle}`}
						/>
					</li>
				</ul>
			</RenderIf>
			<RenderIf condition={isTabView}>
				<ul className='flex items-center gap-5 lg:gap-20 flex-1'>
					<li>
						<Logo />
					</li>

					<li className=''>
						<LinkBtn
							className={'border-none text-xl font-bold text-black'}
							value={capitalizeFirstLetters(courseTitle)}
							path={`/courses/${courseTitle}`}
						/>
					</li>
				</ul>

				<ul className='md:basis-[30%] flex items-center justify-end gap-5'>
					<li className='flex gap-2'>
						<button
							className='px-2 py-3 flex items-center gap-2 border-gray-200'
							onClick={handleReviewModal}
						>
							<FaStar />
							<span>Leave a rating</span>
						</button>
					</li>
					<li>
						<button
							className='flex items-center gap-2 cursor-pointer'
							onClick={handleToggleDropdown}
						>
							<div className='w-9 relative'>
								<Circle
									percent={percentage}
									strokeWidth={13}
									strokeColor='#49A8D9'
									trailWidth={13}
									trailColor={'#D9D9D9'}
								/>
								<div className='position-center'>
									<LiaTrophySolid />
								</div>
							</div>
							<RenderIf condition={isDesktopView}>
								<p className='flex items-center gap-1'>
									<span>Your progress</span>
									<span>
										<IoIosArrowDown />
									</span>
								</p>
							</RenderIf>
						</button>

						<RenderIf condition={toggleDropdown}>
							<div className='absolute z-20  border w-[14rem] right-28 text-center top-[3.5rem] bg-white rounded-lg px-1 py-3 shadow-lg shadow-gray-300'>
								<p className='font-semibold text-sm'>
									{lessonSummary.completed} of {lessonSummary.total} complete.
								</p>
								<p className='text-sm'>Finish course to get your certificate</p>
							</div>
						</RenderIf>
					</li>

					<li className='flex gap-2'>
						<button
							className='px-3 py-1 border-2 border-gray-200'
							onClick={handleShowModal}
						>
							Share
						</button>

						<button className='px-3 py-1 border-2 border-gray-200'>
							<HiDotsHorizontal />
						</button>
					</li>
				</ul>
			</RenderIf>

			{/* Handles share button modal - controls attached to SHARE BTN*/}
			<Modal ref={shareRef} className={'w-1/2 rounded-lg p-3'}>
				<CopyText
					title={'Share this course'}
					value={`${config.urlPath}${location.pathname}`}
				/>
			</Modal>

			<Modal ref={reviewRef} className={'w-1/3 h-max rounded-lg p-3'}>
				<ReviewCourse onCloseModal={handleCloseReviewModal} />
			</Modal>
		</header>
	);
};

export default LectureHeader;
