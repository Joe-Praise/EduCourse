import { FC } from 'react';
import CourseCard from './CourseCard';
import img from '../../assets/image/card3.jpg';
// import LinkBtn from '../LinkBtn';
import CardsPlaceholder from './CardsPlaceholder';

const Courses: FC = () => {
	interface cardProps {
		img: string;
		instructor: string;
		coureTitle: string;
		createdAt: string;
		noOfStudents: string;
		price: string;
	}

	const courses: cardProps[] = [
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			noOfStudents: '1',
			price: '45',
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
		},
		{
			img,
			instructor: 'Joe Praise',
			coureTitle: 'React and Redux master class',
			createdAt: '12-01-2024',
			noOfStudents: '50',
			price: '45',
		},
	];
	return (
		<CardsPlaceholder
			title='Courses'
			description='Explore our Popular Courses'
			path='/courses'
			btnValue='All Courses'
			className='grid-cols-1 sm:grid-cols-3 sm:gap-4 gap-y-8'
		>
			<>
				{courses.map((el, id) => {
					if (id <= 5) {
						return (
							<CourseCard
								key={id}
								img={el.img}
								instructor={el.instructor}
								coureTitle={el.coureTitle}
								createdAt={el.createdAt}
								noOfStudents={el.noOfStudents}
								price={el.price}
							/>
						);
					}
				})}
			</>
		</CardsPlaceholder>
	);
};

export default Courses;
