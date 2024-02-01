import { ChangeEvent, FC, useEffect, useState } from 'react';
import img from '../../assets/image/card5.jpg';
import FilterStructure from '../../components/shared/FilterStructure';
import FilterActionMenu from '../../components/shared/FilterActionMenu';
import CourseCard from '../../components/Course/CourseCard';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/actions/courseAction';
import { RootState } from '../../redux/store';

const Course: FC = () => {
	const dispatch = useDispatch();
	const displayFilter = useSelector(
		(state: RootState) => state.course.filterState
	);
	const [activeLayout, setActiveLayout] = useState('grid');

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
	};

	const handleLayoutChange = (value: string) => {
		setActiveLayout(value);
	};

	const handleCloseFilterOnMobile = () => {
		dispatch(setFilter());
	};

	interface cardProps {
		img: string;
		instructor: string;
		coureTitle: string;
		createdAt: string;
		noOfStudents: string;
		price: string;
		category: string;
		activeLayout: string;
	}

	const courses: cardProps[] = [
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			noOfStudents: '1',
			price: '45',
			category: 'Programming',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
			category: 'Programming',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
			category: 'Programming',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
			category: 'Programming',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
			category: 'Programming',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
			category: 'Programming',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
			category: 'Programming',
			activeLayout,
		},
	];
	const arr2 = Array.from(Array(5), () => 0);
	useEffect(() => {}, [activeLayout, setActiveLayout]);
	return (
		<FilterStructure
			title={'All Courses'}
			searchFunc={handleSearch}
			layoutFunc={handleLayoutChange}
			children1={
				<>
					{courses.map((el, i) => {
						return (
							<CourseCard
								key={i}
								img={el.img}
								instructor={el.instructor}
								coureTitle={el.coureTitle}
								createdAt={el.createdAt}
								noOfStudents={el.noOfStudents}
								price={el.price}
								category={el.category}
								activeLayout={el.activeLayout}
							/>
						);
					})}
				</>
			}
			children2={
				<>
					{arr2.map((_, i) => {
						return <FilterActionMenu header={'Courses Category'} key={i} />;
					})}

					<div
						className='flex absolute top-0 right-0 sm:hidden'
						onClick={handleCloseFilterOnMobile}
					>
						<p className='font-bold'>Filter</p>
						<FaFilter className={displayFilter ? 'fill-effect-active' : ''} />
					</div>
				</>
			}
			activeLayout={activeLayout}
		/>
	);
};

export default Course;
