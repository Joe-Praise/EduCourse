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
				return <InstructorCard key={`instructors_${el._id}`} instructor={el} />;
			})}
		</>
	);
};

export default MappedInstructorCard;
