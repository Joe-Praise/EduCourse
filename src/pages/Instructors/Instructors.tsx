import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
// import { useLocation, useNavigate } from 'react-router-dom';
import {
	InstructorsCardLoading,
	MappedInstructorCard,
} from '../../components/instructor';
import { getInstructorAction } from '../../redux/actions/instructorAction';
import { LoadingPulse } from '../../components/shared';

const Instructors: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	// const navigate = useNavigate();
	// const location = useLocation();
	// const initializeRef = useRef(true);
	const instructors = useSelector(
		(state: RootState) => state.instructor.instructors.data
	);
	const arr = Array.from({ length: 20 }, (_v, i) => i);

	useEffect(() => {
		//TODO:  Implement pagination on the instructors when system scales
		dispatch(getInstructorAction({ page: '1', limit: '20' }));
	}, []);

	const handleInstructorsDisplay = () => {
		if (!instructors) {
			return (
				<>
					{arr.map((_, index) => {
						return (
							<LoadingPulse key={`category_Card_${index}`}>
								<InstructorsCardLoading />
							</LoadingPulse>
						);
					})}
				</>
			);
		} else {
			return <MappedInstructorCard data={instructors} />;
		}
	};
	return (
		<section className='w-10/12 mx-auto mt-3'>
			<div>
				<h1>Instructors</h1>
				<p>Discover Your Perfect Instructor in Our Catalogue</p>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-16'>
				{handleInstructorsDisplay()}
			</div>
		</section>
	);
};

export default Instructors;
