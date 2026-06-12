import { CourseCard, CourseCardSkeleton, type CourseCardData } from '../../features/course';
import CardsPlaceholder from '../Home/CardsPlaceholder';
import { OmittedCourseDataType } from '../../redux/api/courseAPI';

interface Iprop {
	courses: OmittedCourseDataType[];
}

const Courses = (props: Iprop) => {
	const courses = props.courses;
	const skeletons = Array.from({ length: 6 }, (_v, i) => i);

	const handleCourseDisplay = () => {
		if (!courses) {
			return (
				<>
					{skeletons.map((idx) => (
						<CourseCardSkeleton key={idx} />
					))}
				</>
			);
		}
		return (
			<>
				{courses.map((el) => (
					<CourseCard key={el._id} course={el as unknown as CourseCardData} />
				))}
			</>
		);
	};

	return (
		<CardsPlaceholder
			title='Courses'
			description='Explore our Popular Courses'
			path='/courses'
			btnValue='All Courses'
			className='grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'
		>
			{handleCourseDisplay()}
		</CardsPlaceholder>
	);
};

export default Courses;
