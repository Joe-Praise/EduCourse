import { Circle } from 'rc-progress';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoIosArrowDown } from 'react-icons/io';
import { LiaTrophySolid } from 'react-icons/lia';
import Logo from '../shared/Logo';
import LinkBtn from '../shared/LinkBtn';
import RenderIf from '../shared/RenderIf';
import { useNavigate } from 'react-router-dom';
import { IoIosReturnLeft } from 'react-icons/io';
import useHandleModal from '../../hooks/UseHandleModal';
import { ModalRef } from '../../pages/Main Course/LectureType';
import Modal from '../shared/Modal';
import { useRef } from 'react';
import CopyText from '../shared/CopyText';
import { lectureType } from '../../pages/Main Course/LectureType';

const LectureHeader = (props: lectureType) => {
	const navigate = useNavigate();
	const shareRef = useRef<ModalRef>(null);
	const { onWindowSize } = props;
	const isTabView = onWindowSize > 600;
	const isDesktopView = onWindowSize > 1000;
	const {
		modal: toggleDropdown,
		handleModal: handleToggleDropdown,
		// closeModal: closeDropdown,
	} = useHandleModal();

	/**
	 * TODO:Build the archive and favourite course list and functionalities
	 */

	// const {
	// 	modal: shareDropdown,
	// 	handleModal: handleShareDropdown,
	// 	// closeModal: closeDropdown,
	// } = useHandleModal();

	const handleShowModal = () => {
		shareRef.current!.open();
	};

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
							value={'React and Redux Complete Course'}
							path={''}
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
							value={'React and Redux Complete Course'}
							path={''}
						/>
					</li>
				</ul>

				<ul className='md:basis-[30%] flex items-center justify-end gap-5'>
					<li>
						<button
							className='flex items-center gap-2 cursor-pointer'
							onClick={handleToggleDropdown}
						>
							<div className='w-9 relative'>
								<Circle
									percent={60}
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
								<p className='font-semibold text-sm'>202 of 229 complete.</p>
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
			<Modal ref={shareRef}>
				<CopyText
					title={'Share this course'}
					value={
						'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, ea?hvsjflshbdfljghbsldjfbgldsh'
					}
				/>
			</Modal>
		</header>
	);
};

export default LectureHeader;
