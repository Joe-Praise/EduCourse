import { FC } from 'react';
import WhiteBackground from '../WhiteBackground';
import img from '../../assets/image/card1.jpg';
import { IoMdTime } from 'react-icons/io';
import { FaGraduationCap } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { courseCardType } from '../../pages/Home/model/homePageType';

const CourseCard: FC<courseCardType> = (props) => {
	return (
		<WhiteBackground className='rounded-b-none my-4 sm:my-0 w-full px-0 shadow-md hover:scale-105 duration-150'>
			<Link to='/courses/' className='block hover:text-effect-focus'>
				<figure className='h-[16.25rem] w-full'>
					<img src={img} alt='' className='rounded-t-lg h-full w-full' />
				</figure>
				<div className='p-3'>
					<small>
						by <span className='font-bold'>Joe Praise</span>
					</small>
					<p className='text-lg font-bold my-1'>
						Create An LMS Website with LearnPress
					</p>

					<div className='flex items-center gap-3 text-sm'>
						<div className='flex items-center'>
							<IoMdTime className='fill-[#45A5CD]' />
							<span>2 Weeks</span>
						</div>

						<div className='flex items-center'>
							<FaGraduationCap className='fill-[#45A5CD]' />
							<span>150 students</span>
						</div>
					</div>

					<div className='w-auto mx-auto h-[0.1rem] bg-gray-300'></div>

					<div className='flex items-center justify-between mt-1'>
						<p>
							<span className='line-through text-secondary-light'>$29.0</span>{' '}
							<span className='text-green-500'>Free</span>
						</p>

						<div className='border-none text-secondary-dark text-sm'>
							View More
						</div>
					</div>
				</div>
			</Link>
			{/* <Link to='/courses/' className='block hover:text-effect-focus'>
				<figure className='h-[16.25rem] w-full'>
					<img src={props.img} alt='' className='rounded-t-lg h-full w-full' />
				</figure>
				<div className='p-3'>
					<small>
						by <span className='font-bold'>{props.instructor}</span>
					</small>
					<p className='text-lg font-bold my-1'>
						{props.coureTitle}
					</p>

					<div className='flex items-center gap-3 text-sm'>
						<div className='flex items-center'>
							<IoMdTime className='fill-[#45A5CD]' />
							TODO:Format the date better
							<span>{new Date(props.createdAt).toISOString()}</span>
						</div>

						<div className='flex items-center'>
							<FaGraduationCap className='fill-[#45A5CD]' />
							<span>
								{props.noOfStudents}{' '}
								{props.noOfStudents > 1 ? 'students' : 'student'}
							</span>
						</div>
					</div>

					<div className='w-auto mx-auto h-[0.1rem] bg-gray-300'></div>

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
			</Link> */}
		</WhiteBackground>
	);
};

export default CourseCard;
