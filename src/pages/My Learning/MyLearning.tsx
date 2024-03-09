import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import LayoutHeader from '../../widgets/LayoutHeader/LayoutHeader';
import LayoutFooter from '../../widgets/LayoutFooter/LayoutFooter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import {
	getCoursesAction,
	getMyLearningCourseAction,
} from '../../redux/actions/courseAction';
import { AppDispatch } from '../../redux/store';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { OmittedInstructorDataType } from '../../redux/api/instructorApi';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { getInstructorAction } from '../../redux/actions/instructorAction';
import DropDown from '../../components/shared/DropDown';
import {
	formQueryStr,
	getLocalStorage,
} from '../../util/helperFunctions/helper';
import CourseCard from '../../components/Course/CourseCard';
import Pagination from '../../components/shared/Pagination';
import { paginateType } from '../../redux/sharedTypes';

interface progressType {
	completed: 'in progress' | 'completed';
	_id: string;
}

export interface dropDownTypes {
	tag: string;
	items:
		| OmittedCategoryDataType[]
		| OmittedInstructorDataType[]
		| progressType[];
}

const MyLearning: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const initializeRef = useRef(true);
	const category = useSelector((state: RootState) => state.category.categories);
	const instructor = useSelector(
		(state: RootState) => state.instructor.instructors
	);
	const courseState = useSelector((state: RootState) => state.course);
	const metaData = courseState.course.metaData;
	const queryFilterState = courseState.queryFilter;
	const myLearningCourses = courseState.myLearning;

	const [activeLayout, setActiveLayout] = useState('grid');

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
	};

	const limit = '50';

	// const handleLayoutChange = (value: string) => {
	// 	setActiveLayout(value);
	// };

	// const handleCloseFilterOnMobile = () => {
	// 	dispatch(setFilter());
	// };

	const userId = getLocalStorage('profile')?.user?._id;

	useEffect(() => {}, [activeLayout, setActiveLayout]);

	useEffect(() => {
		if (initializeRef.current) {
			console.log('is this reading?');
			dispatch(getMyLearningCourseAction(userId));
			dispatch(getCategoryAction({ page: '1', limit }, 'course'));
			dispatch(getInstructorAction({ page: '1', limit }));
			initializeRef.current = false;
			return;
		}

		// setting query comes from dropdown, this triggers the post request to filter for courses
		if (queryFilterState) {
			const handelQuerySearch = () => {
				const queryStr = formQueryStr(queryFilterState);
				dispatch(getMyLearningCourseAction(userId, queryStr));
			};
			handelQuerySearch();
		}
	}, [dispatch, queryFilterState, userId]);

	const dropDown: dropDownTypes[] = [
		{
			tag: 'category',
			items: category?.data,
		},
		{
			tag: 'instructors',
			items: instructor?.data,
		},
		{
			tag: 'progress',
			items: [
				{
					name: 'in progress',
					_id: 'false',
				},
				{
					name: 'completed',
					_id: 'true',
				},
			],
		},
	];

	const handelQuerySearch = (details: paginateType, queryString: string) => {
		dispatch(getCoursesAction(details, queryString));
	};

	return (
		<section className='layoutHightWithGrid'>
			<LayoutHeader />
			<div className='mt-5 w-[90%] sm:w-[75%] mx-auto'>
				<h1>My Learning</h1>
				<div className='m-2 flex flex-col flex-wrap justify-between md:flex-row gap-6 items-baseline'>
					<div className='order-2 md:order-1 flex gap-5'>
						{dropDown.map((item, index, arr) => {
							return (
								<DropDown
									{...item}
									key={index}
									// handleQuerySearch={handelQuerySearch}
									index={index}
									arrLength={arr.length}
								/>
							);
						})}
					</div>

					<div className='order-1 md:order-2'>
						<form>
							<input
								type='search'
								name='search'
								id='headerSearch'
								placeholder='Search'
								className='searchInput rounded-none'
								onChange={(e) => handleSearch(e)}
							/>
						</form>
					</div>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-16'>
					{myLearningCourses?.data?.map((el: any, idx: number) => {
						return (
							<div key={idx} className='basis-[24%]'>
								<CourseCard activeLayout={activeLayout} {...el} />
							</div>
						);
					})}
				</div>

				<div className='my-3'>
					<Pagination
						metaData={metaData}
						handlePagination={handelQuerySearch}
						queryString={queryFilterState}
					/>
				</div>
			</div>

			<LayoutFooter />
		</section>
	);
};

export default MyLearning;
