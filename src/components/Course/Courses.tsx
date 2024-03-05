import { FC, useEffect } from 'react';
import CourseCard from './CourseCard';
import CardsPlaceholder from '../Home/CardsPlaceholder';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getCoursesAction } from '../../redux/actions/courseAction';
import LoadingEffect from '../shared/LoadingEffect';

const Courses: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const coursesData = useSelector((state: RootState) => state.course.course);

	useEffect(() => {
		dispatch(getCoursesAction({ page: '1', limit: '6' }));
	}, [dispatch]);

	// console.log(coursesData.data);

	// const courses: courseCardType[] = [
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		noOfStudents: '1',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout: 'grid',
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout: 'grid',
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout: 'grid',
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout: 'grid',
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout: 'grid',
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout: 'grid',
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout: 'grid',
	// 	},
	// ];

	const handleCourseDisplay = () => {
		if (coursesData?.data?.length < 1) {
			return (
				<div>
					<LoadingEffect />
				</div>
			);
		} else {
			return (
				<CardsPlaceholder
					title='Courses'
					description='Explore our Popular Courses'
					path='/courses'
					btnValue='All Courses'
					className='grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'
				>
					<>
						{coursesData?.data?.map((el: any) => {
							return <CourseCard key={el._id} activeLayout='grid' {...el} />;
						})}
					</>
				</CardsPlaceholder>
			);
		}
	};

	return <div>{handleCourseDisplay()}</div>;
};

export default Courses;
