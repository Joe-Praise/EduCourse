import InstructorCard from './InstructorCard';
import { InstructorType } from '../../redux/api/instructorApi';
import CardsPlaceholder from '../Home/CardsPlaceholder';
import { CategoryCardLoading, LoadingPulse } from '../shared';

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
									<CategoryCardLoading />
								</LoadingPulse>
							);
						}
					})}
				</>
			);
		} else {
			return (
				<>
					{instructors?.map((el: InstructorType) => {
						return (
							<InstructorCard
								key={`instructors_${el._id}`}
								img={el.userId?.photo}
								name={el.userId?.name}
								expertise={'Upcoming'}
								noOfStudents={'500'}
								noOfCourses={'100'}
							/>
						);
					})}
				</>
			);
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
