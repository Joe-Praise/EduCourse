// import { useEffect } from 'react';
import CourseCard from './CourseCard';
import CardsPlaceholder from '../Home/CardsPlaceholder';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../redux/store';
// import { getCoursesAction } from '../../redux/actions/courseAction';
import { LoadingPulse } from '../shared';
import CourseCardLoading from './CourseCardLoading';
import { OmittedCourseDataType } from '../../redux/api/courseAPI';

interface Iprop {
	courses: OmittedCourseDataType[];
}

const Courses = (props: Iprop) => {
	const courses = props.courses;
	const arr = Array.from({ length: 6 }, (_v, i) => i);

	const handleCourseDisplay = () => {
		if (!courses) {
			return (
				<>
					{arr.map((_el, index) => (
						<LoadingPulse key={index}>
							<CourseCardLoading />
						</LoadingPulse>
					))}
				</>
			);
		} else {
			return (
				<>
					{courses.map((el: any) => {
						return <CourseCard key={el._id} activeLayout='grid' {...el} />;
					})}
				</>
			);
		}
	};

	return (
		<CardsPlaceholder
			title='Courses'
			description='Explore our Popular Courses'
			path='/courses'
			btnValue='All Courses'
			className='grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'
		>
			{handleCourseDisplay()}
		</CardsPlaceholder>
	);
};

export default Courses;
