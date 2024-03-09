import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import FilterStructure from '../../components/shared/FilterStructure';
import FilterActionMenu from '../../components/shared/FilterActionMenu';
import CourseCard from '../../components/Course/CourseCard';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAutoCompleteAllCourseAction,
	getCoursesAction,
	resetAutoCompleteAction,
	setFilter,
} from '../../redux/actions/courseAction';
import { AppDispatch, RootState } from '../../redux/store';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { autocompleteType, ratingSummaryType } from '../../redux/api/courseAPI';
import { getInstructorAction } from '../../redux/actions/instructorAction';
import { OmittedInstructorDataType } from '../../redux/api/instructorApi';
import useDebounce from '../../hooks/UseDebounce';
import { formQueryStr } from '../../util/helperFunctions/helper';
import Pagination from '../../components/shared/Pagination';
import { paginateType } from '../../redux/sharedTypes';
import LoadingEffect from '../../components/shared/LoadingEffect';
import { useLocation, useNavigate } from 'react-router-dom';

const Course: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const initializeRef = useRef(true);
	const courseState = useSelector((state: RootState) => state.course);
	const category = useSelector((state: RootState) => state.category.categories);
	const instructor = useSelector(
		(state: RootState) => state.instructor.instructors
	);

	const metaData = courseState.course.metaData;
	const queryFilterState = courseState.queryFilter;
	const displayFilter = courseState.filterState;
	const coursesData = courseState.course;
	const autocomplete = courseState.autoComplete;

	const [activeLayout, setActiveLayout] = useState('grid');
	const [search, setSearch] = useState('');
	const limit = '6';
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
		if (debouncedSearch.length <= 2) {
			dispatch(resetAutoCompleteAction());
			return;
		}

		dispatch(getAutoCompleteAllCourseAction(debouncedSearch));
	}, [dispatch, debouncedSearch]);

	useEffect(() => {
		dispatch(getCoursesAction({ page: '1', limit }));
		dispatch(getCategoryAction({ page: '1', limit: '30' }, 'course'));
		dispatch(getInstructorAction({ page: '1', limit: '10' }));
	}, [dispatch]);

	type priceCategory = { _id: string; name: 'Free' | 'Paid' };

	type level = { _id: string; name: string };

	type reviewType = ratingSummaryType & {
		_id: number;
	};

	interface overAll {
		Category: OmittedCategoryDataType[];
		Price: priceCategory[];
		Instructors: OmittedInstructorDataType[];
		Level: level[];
		Review: reviewType[];
	}

	const filterData: overAll = {
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
		Instructors: instructor?.data,
		Level: [{ _id: 'All Levels', name: 'All Levels' }],
	};

	useEffect(() => {
		if (initializeRef.current) {
			initializeRef.current = false;
			return;
		}

		const timeout = setTimeout(() => {
			const queryStr = formQueryStr(queryFilterState);
			dispatch(getCoursesAction({ page: '1', limit }, queryStr));
		}, 700);

		return () => clearTimeout(timeout);
	}, [dispatch, queryFilterState]);

	// handles Pagination dispatch
	const handelQuerySearch = (details: paginateType, queryString: string) => {
		dispatch(getCoursesAction(details, queryString));
	};

	const handleRedirectFunc = (course: autocompleteType) => {
		const slug = course?.slug;
		navigate(`${location.pathname}/${slug}`);
	};

	const handleCourseDisplay = () => {
		if (coursesData.data.length < 1) {
			return (
				<div>
					<LoadingEffect />
				</div>
			);
		} else {
			return (
				<>
					{coursesData?.data?.map((el: any) => {
						return (
							<CourseCard key={el._id} activeLayout={activeLayout} {...el} />
						);
					})}
				</>
			);
		}
	};

	return (
		<FilterStructure
			title={'All Courses'}
			searchFunc={handleSearch}
			autocomplete={autocomplete}
			redirectFunc={handleRedirectFunc}
			layoutFunc={handleLayoutChange}
			children1={<>{handleCourseDisplay()}</>}
			children2={
				<>
					{Object.entries(filterData).map(([key, value], i) => {
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
			children3={
				<>
					<Pagination
						metaData={metaData}
						handlePagination={handelQuerySearch}
						queryString={queryFilterState}
					/>
				</>
			}
			activeLayout={activeLayout}
		/>
	);
};

export default Course;
