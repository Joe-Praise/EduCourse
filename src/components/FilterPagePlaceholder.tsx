import { ChangeEvent, FC, useEffect, useState } from 'react';
import FilterPageHeader from './FilterPageHeader';
import CourseCard from './Course/CourseCard';
import img from '../assets/image/card5.jpg';
import FilterActionMenu from './FilterActionMenu';
// import FilterActionBtn from './FilterActionBtn';

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

	const arr = Array.from(Array(4), () => 0);
	const arr2 = Array.from(Array(5), () => 0);
	return (
		<section className='grid grid-cols-6 gap-3 xl:gap-12 w-11/12 sm:w-9/12 md:w-11/12 xl:w-9/12 mx-auto mt-2 relative'>
			<div className='col-start-1 col-span-6 sm:col-span-4 '>
				<FilterPageHeader
					title='All Courses'
					searchFunc={handleSearch}
					layoutFunc={handleLayoutChange}
					activeLayout={activeLayout}
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
				<ul className='flex gap-2 justify-center'>
					{arr.map((_, i) => {
						return (
							<li
								key={i}
								className='w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer  duration-150 hover:bg-black hover:text-white'
							>
								{i + 1}
							</li>
						);
					})}
				</ul>
			</div>
			<div
				className='col-span-2 absolute 
			-translate-x-52 sm:translate-x-0 sm:sticky top-0 w-10/12 mx-auto max-h-[85vh] overflow-y-auto
			'
			>
				{arr2.map((_, i) => {
					return (
						<FilterActionMenu header={'Courses Category'} key={i}>
							{/* <FilterActionBtn /> */}
						</FilterActionMenu>
					);
				})}
			</div>
		</section>
	);
};

export default FilterPagePlaceholder;
