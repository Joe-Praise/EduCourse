import { InstructorType } from '../../redux/api/instructorApi';
import InstructorCard from './InstructorCard';

interface Iprop {
	data: InstructorType[];
}

const MappedInstructorCard = (props: Iprop) => {
	const { data } = props;
	return (
		<>
			{data?.map((el: InstructorType) => {
				return (
					<InstructorCard
						key={`instructors_${el._id}`}
						img={el.userId?.photo}
						name={el.userId?.name}
						expertise={'Upcoming'}
						noOfStudents={'500'}
						noOfCourses={'100'}
						_id={el.userId?._id}
					/>
				);
			})}
		</>
	);
};

export default MappedInstructorCard;
