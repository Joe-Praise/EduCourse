import { ChangeEvent, FC, useEffect, useState } from 'react';
import FilterPageHeader from './FilterPageHeader';
import CourseCard from './Home/CourseCard';
import img from '../assets/image/card5.jpg';

const FilterPagePlaceholder: FC = () => {
	const [activeLayout, setActiveLayout] = useState('grid');

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
	};

	const handleLayoutChange = (value: string) => {
		setActiveLayout(value);
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

	useEffect(() => {}, [activeLayout, setActiveLayout]);
	return (
		<section className='grid grid-cols-6 gap-3 w-10/12 sm:w-9/12 mx-auto my-6 relative'>
			<div className='col-start-1 col-span-6 sm:col-span-4 '>
				<FilterPageHeader
					title='All Courses'
					searchFunc={handleSearch}
					layoutFunc={handleLayoutChange}
				/>

				<div
					className={`${
						activeLayout === 'grid'
							? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
							: 'gap-4'
					} my-2 p-2`}
				>
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
				</div>
			</div>
			<div
				className='col-span-2 hidden absolute 
			-translate-x-52 sm:static
			'
			>
				span 0
			</div>
		</section>
	);
};

export default FilterPagePlaceholder;
