import { OmittedCourseDataType } from '../../redux/api/courseAPI';
import { CourseCard } from '../Course';
import { UserCoursesSectionWrapper } from '../shared';

interface UserCoursesSectionProps {
	activeLayout: string;
	data: OmittedCourseDataType[];
}

const UserCoursesSection = (props: UserCoursesSectionProps) => {
	const { activeLayout, data } = props;
	return (
		<UserCoursesSectionWrapper>
			{data?.map((el: any, idx: number) => {
				return (
					<div key={idx} className='basis-[24%]'>
						<CourseCard activeLayout={activeLayout} {...el} />
					</div>
				);
			})}
		</UserCoursesSectionWrapper>
	);
};

export default UserCoursesSection;
