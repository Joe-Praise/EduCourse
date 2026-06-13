import { OmittedCourseDataType } from '../../redux/api/courseAPI';
import { type CourseCardData } from '../../features/course';
import MyLearningCourseCard from './MyLearningCourseCard';

interface UserCoursesSectionProps {
	data: OmittedCourseDataType[];
}

const UserCoursesSection = (props: UserCoursesSectionProps) => {
	const { data } = props;
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12'>
			{data?.map((el, idx: number) => {
				const card = el as unknown as CourseCardData & {
					_id: string;
					courseId?: { _id: string } | string;
				};
				return (
					<MyLearningCourseCard key={card._id ?? idx} course={card} priority={idx < 4} />
				);
			})}
		</div>
	);
};

export default UserCoursesSection;
