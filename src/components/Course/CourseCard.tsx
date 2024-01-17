import { FC } from 'react';
import WhiteBackground from '../WhiteBackground';
import { IoMdTime } from 'react-icons/io';
import { FaGraduationCap } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { courseCardType } from '../../pages/Home/types/homePageType';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';

const CourseCard: FC<courseCardType> = (props) => {
	return (
		<WhiteBackground
			className={`rounded-b-none my-0 w-full px-0 shadow-md hover:scale-105 duration-150  ${
				props.activeLayout === 'grid' ? 'sm:my-0' : 'my-5'
			}`}
		>
			<Link
				to='/courses/'
				className={` hover:text-effect-active relative ${
					props.activeLayout === 'grid' ? 'block' : 'flex h-[11rem]'
				}`}
			>
				<figure
					className={` ${
						props.activeLayout === 'grid' ? 'h-[11rem]' : 'basis-[50%]'
					}`}
				>
					<img
						src={props.img}
						alt=''
						className={`${
							props.activeLayout === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'
						} h-full w-full object-cover`}
					/>
				</figure>
				<div
					className={`p-3 ${
						props.activeLayout === 'grid' ? 'basis-[50%]' : 'basis-full'
					}`}
				>
					<small>
						by <span className='font-bold'>{props.instructor}</span>
					</small>
					<p className='text-lg font-bold my-1'>{props.coureTitle}</p>

					<div
						className={`items-center gap-3 text-sm ${
							props.activeLayout === 'grid' ? 'flex' : 'block'
						}`}
					>
						<div className='flex items-center gap-1'>
							<IoMdTime className='fill-[#45A5CD]' />
							<span>{handleDateFormat(props.createdAt)}</span>
						</div>

						<div className='flex items-center gap-1'>
							<FaGraduationCap className='fill-[#45A5CD]' />
							<span>
								{props.noOfStudents}{' '}
								{+props.noOfStudents > 1 ? 'students' : 'student'}
							</span>
						</div>
					</div>

					<div className=''>
						<div className='w-auto mx-auto mt-3 h-[0.1rem] bg-gray-300'></div>

						<div className='flex items-center justify-between mt-1'>
							<p>
								<span className='line-through text-secondary-light'>
									${props.price}
								</span>{' '}
								<span className='text-green-500'>Free</span>
							</p>

							<div className='border-none text-secondary-dark text-sm'>
								View More
							</div>
						</div>
					</div>
				</div>
				<div className='badge'>
					<span className='text-xs'>{props.category}</span>
				</div>
			</Link>
		</WhiteBackground>
	);
};

export default CourseCard;
