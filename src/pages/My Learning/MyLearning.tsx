import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import LayoutHeader from '../../widgets/LayoutHeader/LayoutHeader';
import LayoutFooter from '../../widgets/LayoutFooter/LayoutFooter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import {
	getAutoCompleteMyLearningAction,
	getMyLearningCourseAction,
	resetMyLearningAutoCompleteAction,
	setLoadingAction,
} from '../../redux/actions/courseAction';
import { AppDispatch } from '../../redux/store';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { OmittedInstructorDataType } from '../../redux/api/instructorApi';
import { getRegisteredCategoryAction } from '../../redux/actions/categoryAction';
import { GetMyLearningInstructorAction } from '../../redux/actions/instructorAction';
import { DropDown, Pagination, LoadingPulse } from '../../components/shared';
import {
	formQueryStr,
	getLocalStorage,
} from '../../util/helperFunctions/helper';
import { CourseCard, CourseCardLoading } from '../../components/Course';
import { paginateType } from '../../redux/sharedTypes';
import useDebounce from '../../hooks/UseDebounce';
import { Link } from 'react-router-dom';

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
	const userId = getLocalStorage('profile')?.user?._id;
	const dispatch: AppDispatch = useDispatch();
	// const limit = '50';
	const initializeRef = useRef(true);
	const category = useSelector(
		(state: RootState) => state.category.registeredCategories
	);
	const instructor = useSelector(
		(state: RootState) => state.instructor.instructors
	);
	const courseState = useSelector((state: RootState) => state.course);

	// get required data from the store
	const metaData = courseState.myLearning.metaData;
	const queryFilterState = courseState.queryFilter;
	const myLearningCourses = courseState.myLearning;
	const myLearningSearch = courseState.myLearningAutoComplete;
	const loading = courseState.loading;
	const notification = courseState.notification;

	const [activeLayout, setActiveLayout] = useState('grid');
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	useEffect(() => {
		// if search is less than 3 characters, reset the search
		if (debouncedSearch.length <= 2) {
			dispatch(resetMyLearningAutoCompleteAction());
			return;
		}

		// else if search is more than 2 characters, dispatch the search
		// and set the loading state to true for loader
		dispatch(setLoadingAction());

		// dispatch the search
		dispatch(getAutoCompleteMyLearningAction(debouncedSearch));
	}, [dispatch, debouncedSearch]);

	useEffect(() => {}, [activeLayout, setActiveLayout]);

	const handelQuerySearch = (details: paginateType) => {
		const queryStr = formQueryStr(queryFilterState);
		dispatch(getMyLearningCourseAction(details, userId, queryStr));
	};

	useEffect(() => {
		// initializeRef is used to track the initial render of the component
		// if initializeRef is true, get courses user has registered for
		if (initializeRef.current) {
			// set loading to true
			dispatch(setLoadingAction());

			// get courses user has registered for
			dispatch(getMyLearningCourseAction({ page: '1', limit: '8' }, userId));

			// get categories for courses user has regidtered for
			dispatch(getRegisteredCategoryAction(userId));

			// get instructors for courses user has regidtered for
			dispatch(GetMyLearningInstructorAction(userId));

			// set initializeRef to false
			initializeRef.current = false;
			return;
		}

		// setting query comes from dropdown, this triggers the post request to filter for courses
		if (queryFilterState) {
			const handelQuerySearch = () => {
				// set loading to true
				dispatch(setLoadingAction());

				// generate custom query string form the queryFilterState
				const queryStr = formQueryStr(queryFilterState);

				// set pagination details
				const details = { page: '1', limit: '8' };

				// get courses user has registered for
				dispatch(getMyLearningCourseAction(details, userId, queryStr));
			};

			// call the function
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
					_id: 'inprogress',
				},
				{
					name: 'completed',
					_id: 'completed',
				},
			],
		},
	];

	/**
	 * THIS FUNCTION HANDELES THE DISPLAY OF THE CARDS */
	const arr = Array.from({ length: 8 }, (_v, i) => i);
	const handleMyLearningDisplay = () => {
		if (loading && notification.length === 0) {
			return (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-16'>
					{arr.map((_el, index) => (
						<LoadingPulse key={index}>
							<CourseCardLoading />
						</LoadingPulse>
					))}
				</div>
			);
		} else if (myLearningSearch?.length > 0 && !loading) {
			return (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-16'>
					{myLearningSearch?.map((el: any, idx: number) => {
						return (
							<div key={idx} className='basis-[24%]'>
								<CourseCard activeLayout={activeLayout} {...el} />
							</div>
						);
					})}
				</div>
			);
		} else if (myLearningCourses?.data?.length > 0 && !loading) {
			return (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-16'>
					{myLearningCourses?.data?.map((el: any, idx: number) => {
						return (
							<div key={idx} className='basis-[24%]'>
								<CourseCard activeLayout={activeLayout} {...el} />
							</div>
						);
					})}
				</div>
			);
		} else if (myLearningCourses.length < 1 && notification.length) {
			return (
				<div className='flex flex-col gap-2 justify-center items-center h-[110vw] md:h-[25vw] uppercase'>
					<h1 className='text-xlg text-center'>
						You haven&apos;t completed any course yet!
					</h1>
					<Link to={'/courses'} className='underline text-lg'>
						Explore Courses
					</Link>
				</div>
			);
		} else {
			return (
				<div className='flex flex-col gap-2 justify-center items-center h-[110vw] md:h-[25vw] uppercase'>
					<h1 className='text-xlg text-center'>
						Have you Registered for a course?
					</h1>
					<Link to={'/courses'} className='underline text-lg'>
						Explore Courses
					</Link>
				</div>
			);
		}
	};
	// ENDS HERE

	return (
		<section className='layoutHightWithGrid'>
			<LayoutHeader />
			<div className='mt-5 w-[90%] sm:w-[75%] mx-auto'>
				<h1>My Learning</h1>
				<div className='md:m-2 flex flex-col flex-wrap justify-between md:flex-row gap-6 items-baseline'>
					<div className='order-2 text-sm md:text-base md:order-1 flex gap-2 md:gap-5'>
						{dropDown.map((item, index, arr) => {
							return (
								<DropDown
									{...item}
									key={index}
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

				<>{handleMyLearningDisplay()}</>

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

// const handelQuerySearch = (details: paginateType) => {
// 	const queryStr = formQueryStr(queryFilterState);
// 	dispatch(getMyLearningCourseAction(details, userId, queryStr));
// };

// if (queryFilterState) {
// 	const handelQuerySearch = () => {
// 		const queryStr = formQueryStr(queryFilterState);
// 		dispatch(
// 			getMyLearningCourseAction({ page: '1', limit: '8' }, userId, queryStr)
// 		);
// 	};
// 	handelQuerySearch();
// }
