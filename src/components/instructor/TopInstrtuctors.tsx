import { InstructorType } from '../../redux/api/instructorApi';
import CardsPlaceholder from '../Home/CardsPlaceholder';
import { LoadingPulse } from '../shared';
import InstructorsCardLoading from './InstructorsCardLoading';
import MappedInstructorCard from './MappedInstructorCard';

interface Iprop {
	instructors: InstructorType[];
}
const TopInstrtuctors = (props: Iprop) => {
	const instructors = props.instructors;

	const arr = Array.from({ length: 4 }, (_v, i) => i);
	const handleCategoryDisplay = () => {
		if (!instructors) {
			return (
				<>
					{arr.map((_, index) => {
						if (index <= 6) {
							return (
								<LoadingPulse key={`category_Card_${index}`}>
									<InstructorsCardLoading />
								</LoadingPulse>
							);
						}
					})}
				</>
			);
		} else {
			return <MappedInstructorCard data={instructors} />;
		}
	};

	return (
		<div>
			<CardsPlaceholder
				className='grid-cols-2 sm:grid-cols-4 gap-4'
				title={'Top Instructors'}
				description={'Explore our Top Instructors'}
				path={'/instructors'}
				btnValue={'All Instructors'}
			>
				{handleCategoryDisplay()}
			</CardsPlaceholder>
		</div>
	);
};

export default TopInstrtuctors;
