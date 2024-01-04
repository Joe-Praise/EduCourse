import { FC } from 'react';
import CourseCard from './CourseCard';
import LinkBtn from '../LinkBtn';

const Courses: FC = () => {
	return (
		<div>
			<div className='flex justify-between items-center'>
				<div>
					<h1>Courses</h1>
					<p>Explore our Popular Courses</p>
				</div>
				<LinkBtn
					className='block py-1 hover:text-effect-hover hover:border-effect-hover'
					value='All Courses'
					path='/Courses'
				/>
			</div>
			<div className='sm:grid grid-cols-3 sm:gap-4 my-3'>
				<CourseCard />
				<CourseCard />
				<CourseCard />
			</div>
		</div>
	);
};

export default Courses;
