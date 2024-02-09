import { ChangeEvent, FC, useEffect, useState } from 'react';
import LayoutHeader from '../../widgets/LayoutHeader/LayoutHeader';
import LayoutFooter from '../../widgets/LayoutFooter/LayoutFooter';
import FilterStructure from '../../components/shared/FilterStructure';
import img from '../../assets/image/card5.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { setFilter } from '../../redux/actions/courseAction';
import CourseCard from '../../components/Course/CourseCard';
import FilterActionMenu from '../../components/shared/FilterActionMenu';
import { FaFilter } from 'react-icons/fa6';
import { FilterType } from '../../components/shared/type';

const MyLearning: FC = () => {
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

	type priceCategory = { _id: string; name: 'Free' | 'Paid' };

	type level = { _id: string; name: string };

	type instructorType = {
		_id: string;
		name: string;
	};

	interface overAll {
		Category: FilterType[];
		Price: priceCategory[];
		Instructor: instructorType[];
		Level: level[];
	}

	const dataClone: overAll = {
		Category: [
			{
				_id: '658ab986d421165a9bf08666',
				name: 'building',
			},
			{
				_id: '65bccf37a4916e592cd7a757',
				name: 'Development',
			},
			{
				_id: '65bccf5ba4916e592cd7a75a',
				name: 'Business',
			},
			{
				_id: '65bccf70a4916e592cd7a75d',
				name: 'Finance & Accounting',
			},
			{
				_id: '65bccf85a4916e592cd7a760',
				name: 'IT & Software',
			},
			{
				_id: '65bccfc2a4916e592cd7a763',
				name: 'Office Productivity',
			},
			{
				_id: '65bccfdba4916e592cd7a766',
				name: 'Personal Development',
			},
			{
				_id: '65bccfe8a4916e592cd7a769',
				name: 'Design',
			},
			{
				_id: '65bccff5a4916e592cd7a76c',
				name: 'Marketing',
			},
			{
				_id: '65bcd009a4916e592cd7a76f',
				name: 'Life Style',
			},
			{
				_id: '65bcd01fa4916e592cd7a772',
				name: 'Photography & Video',
			},
			{
				_id: '65bcd02ea4916e592cd7a775',
				name: 'Health & Fitness',
			},
			{
				_id: '65bcd042a4916e592cd7a778',
				name: 'Music',
			},
			{
				_id: '65bcd057a4916e592cd7a77b',
				name: 'Teaching & Academics',
			},
		],
		Price: [
			{ _id: 'Free', name: 'Free' },
			{ _id: 'Paid', name: 'Paid' },
		],
		Instructor: [
			{
				_id: '6588bd1f4b2862fbec0ace9c',
				name: 'Tosin',
			},
			{
				_id: '6588bd1f4b2862fbec0ace9b',
				name: 'Tosin',
			},
			{
				_id: '6588bd1f4b2862fbec0ace9a',
				name: 'Tosin',
			},
		],
		Level: [{ _id: 'All Levels', name: 'All Levels' }],
	};
	// const arr2 = Array.from(Array(5), () => 0);
	useEffect(() => {}, [activeLayout, setActiveLayout]);
	return (
		<>
			<LayoutHeader />
			<main className='min-h-[65.1vh] py-5'>
				<FilterStructure
					title={'My Learning'}
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
							{Object.entries(dataClone).map(([key, value], i) => {
								return <FilterActionMenu header={key} values={value} key={i} />;
							})}

							<div
								className='flex absolute top-0 right-0 sm:hidden'
								onClick={handleCloseFilterOnMobile}
							>
								<p className='font-bold'>Filter</p>
								<FaFilter
									className={displayFilter ? 'fill-effect-active' : ''}
								/>
							</div>
						</>
					}
					activeLayout={activeLayout}
				/>
			</main>
			<LayoutFooter />
		</>
	);
};

export default MyLearning;
