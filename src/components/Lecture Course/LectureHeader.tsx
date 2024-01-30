import { Circle } from 'rc-progress';
import { FC } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoIosArrowDown } from 'react-icons/io';
import { LiaTrophySolid } from 'react-icons/lia';
import Logo from '../shared/Logo';
import LinkBtn from '../shared/LinkBtn';

const LectureHeader: FC = () => {
	return (
		<header className='flex items-center justify-between h-14 bg-white px-4 rounded-lg shadow-md p-3'>
			<ul className='flex items-center gap-20 basis-[40%]'>
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

			<ul className='basis-[20%] flex items-center gap-5'>
				<li>
					<button className='flex items-center gap-2 cursor-pointer'>
						<div className='w-9 relative'>
							<Circle
								percent={60}
								strokeWidth={13}
								strokeColor='#49A8D9'
								trailWidth={13}
								trailColor={'#D9D9D9'}
							/>
							<LiaTrophySolid className='absolute top-[25%] left-[22%] text-xl  ' />
						</div>
						<p className='flex items-center gap-1'>
							<span>Your progress</span>
							<span>
								<IoIosArrowDown />
							</span>
						</p>
					</button>
				</li>

				<li className='flex gap-3'>
					<button className='px-3 py-1 border-2 border-gray-200 '>Share</button>

					<button className='px-3 py-1 border-2 border-gray-200'>
						<HiDotsHorizontal />
					</button>
				</li>
			</ul>
		</header>
	);
};

export default LectureHeader;
