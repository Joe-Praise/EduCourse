import { ChangeEvent, FC, useEffect, useState } from 'react';
// import img from '../../assets/image/card5.jpg';
import FilterStructure from '../../components/shared/FilterStructure';
import FilterActionMenu from '../../components/shared/FilterActionMenu';
import CourseCard from '../../components/Course/CourseCard';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesAction, setFilter } from '../../redux/actions/courseAction';
import { AppDispatch, RootState } from '../../redux/store';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { ratingSummaryType } from '../../redux/api/courseAPI';
import { getInstructorAction } from '../../redux/actions/instructorAction';
import { OmittedInstructorDataType } from '../../redux/api/instructorApi';
import useDebounce from '../../hooks/UseDebounce';
// import { Instructor, Category } from '../Home/homePageType';

const Course: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const courseState = useSelector((state: RootState) => state.course);
	const category = useSelector((state: RootState) => state.category.categories);
	const instructor = useSelector(
		(state: RootState) => state.instructor.instructors
	);

	const displayFilter = courseState.filterState;
	const coursesData = courseState.course;

	const [activeLayout, setActiveLayout] = useState('grid');
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
	};

	const handleLayoutChange = (value: string) => {
		setActiveLayout(value);
	};

	const handleCloseFilterOnMobile = () => {
		dispatch(setFilter());
	};

	useEffect(() => {
		console.log(debouncedSearch);
	}, [debouncedSearch]);

	useEffect(() => {
		dispatch(getCoursesAction({ page: '1', limit: '6' }));
		dispatch(getCategoryAction({ page: '1', limit: '0' }));
		dispatch(getInstructorAction({ page: '1', limit: '0' }));
	}, [dispatch]);

	// interface cardProps {
	// 	img: string;
	// 	instructor: string;
	// 	coureTitle: string;
	// 	createdAt: string;
	// 	noOfStudents: string;
	// 	price: string;
	// 	category: string;
	// 	activeLayout: string;
	// }

	// const courses: cardProps[] = [
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		noOfStudents: '1',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		coureTitle: 'React and Redux master class',
	// 		createdAt: '12-01-2024',
	// 		noOfStudents: '50',
	// 		price: '45',
	// 		category: 'Programming',
	// 		activeLayout,
	// 	},
	// ];

	type priceCategory = { _id: string; name: 'Free' | 'Paid' };

	type level = { _id: string; name: string };

	type reviewType = ratingSummaryType & {
		_id: number;
	};

	interface overAll {
		Category: OmittedCategoryDataType[];
		Price: priceCategory[];
		Instructor: OmittedInstructorDataType[];
		Level: level[];
		Review: reviewType[];
	}

	const dataClone: overAll = {
		Category: category?.data,
		Review: [
			{ title: '5', value: 0, _id: 5 },

			{ title: '4', value: 0, _id: 4 },

			{ title: '3', value: 0, _id: 3 },

			{ title: '2', value: 0, _id: 2 },

			{ title: '1', value: 0, _id: 1 },
		],
		Price: [
			{ _id: 'Free', name: 'Free' },
			{ _id: 'Paid', name: 'Paid' },
		],
		Instructor: instructor?.data,
		Level: [{ _id: 'All Levels', name: 'All Levels' }],
	};

	// console.log(instructor);
	useEffect(() => {}, []);
	return (
		<FilterStructure
			title={'All Courses'}
			searchFunc={handleSearch}
			layoutFunc={handleLayoutChange}
			children1={
				<>
					{coursesData?.data?.map((el: any) => {
						return (
							<CourseCard key={el._id} activeLayout={activeLayout} {...el} />
						);
					})}
				</>
			}
			children2={
				<>
					{Object.entries(dataClone).map(([key, value], i) => {
						// console.log(typeof key, value);
						return <FilterActionMenu header={key} values={value} key={i} />;
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
