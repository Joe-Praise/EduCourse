import { ChangeEvent, FC, useEffect, useState } from 'react';
import img from '../../../assets/image/card5.jpg';
import FilterStructure from '../../../components/FilterStructure';
import FilterActionMenu from '../../../components/FilterActionMenu';
import CourseCard from '../../../components/Course/CourseCard';

const Blog: FC = () => {
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
						return (
							<FilterActionMenu header={'Courses Category'} key={i}>
								{/* <FilterActionBtn /> */}
							</FilterActionMenu>
						);
					})}
				</>
			}
			activeLayout={activeLayout}
		/>
	);
};

export default Blog;
