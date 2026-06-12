import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X } from 'lucide-react';
import { RootState } from '../../redux/reducers';
import {
	getAutoCompleteMyLearningAction,
	getMyLearningCourseAction,
	removeMyLearningQueryFilterAction,
	resetMyLearningAutoCompleteAction,
	setLoadingAction,
} from '../../redux/actions/courseAction';
import { AppDispatch } from '../../redux/store';
import { getRegisteredCategoryAction } from '../../redux/actions/categoryAction';
import { GetMyLearningInstructorAction } from '../../redux/actions/instructorAction';
import { Pagination } from '../../components/shared';
import { CourseCardSkeleton } from '../../features/course';
import { formQueryStr } from '../../util/helperFunctions/helper';
import { paginateType } from '../../redux/sharedTypes';
import useDebounce from '../../hooks/UseDebounce';
import {
	MyLearningEmpty,
	MyLearningFilters,
	UserCoursesSection,
} from '../../components/My Learning';

const MyLearning: FC = () => {
	const userId = useSelector((state: RootState) => state.user.userObj?._id);
	const dispatch: AppDispatch = useDispatch();
	const initializeRef = useRef(true);

	const category = useSelector(
		(state: RootState) => state.category.registeredCategories,
	);
	const instructor = useSelector(
		(state: RootState) => state.instructor.myLearningInstructors,
	);
	const courseState = useSelector((state: RootState) => state.course);

	const metaData = courseState.myLearning.metaData;
	const queryFilterState = courseState.myLearningQueryFilter as Record<string, string>;
	const myLearningCourses = courseState.myLearning;
	const myLearningSearch = courseState.myLearningAutoComplete;
	const loading = courseState.loading;
	const notification = courseState.notification;

	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
	const clearSearch = () => {
		setSearch('');
		dispatch(resetMyLearningAutoCompleteAction());
	};
	const clearFilters = () => {
		Object.entries(queryFilterState ?? {}).forEach(([key, value]) =>
			dispatch(removeMyLearningQueryFilterAction({ [key]: value })),
		);
	};

	// ─── Autocomplete search ────────────────────────────────────────────────────
	useEffect(() => {
		if (debouncedSearch.trim().length <= 2) {
			dispatch(resetMyLearningAutoCompleteAction());
			return;
		}
		dispatch(setLoadingAction());
		dispatch(getAutoCompleteMyLearningAction(debouncedSearch));
	}, [dispatch, debouncedSearch]);

	const handelQuerySearch = (details: paginateType) => {
		const queryStr = formQueryStr(queryFilterState);
		dispatch(getMyLearningCourseAction(details, userId, queryStr));
	};

	// ─── Initial load + react to filter changes ─────────────────────────────────
	useEffect(() => {
		if (initializeRef.current) {
			dispatch(setLoadingAction());
			dispatch(getMyLearningCourseAction({ page: '1', limit: '8' }, userId));
			dispatch(getRegisteredCategoryAction(userId));
			dispatch(GetMyLearningInstructorAction(userId));
			initializeRef.current = false;
			return;
		}

		dispatch(setLoadingAction());
		const queryStr = formQueryStr(queryFilterState);
		dispatch(getMyLearningCourseAction({ page: '1', limit: '8' }, userId, queryStr));
	}, [dispatch, queryFilterState, userId]);

	// ─── Derived display state ───────────────────────────────────────────────────
	const courses = myLearningCourses?.data ?? [];
	const searchResults = myLearningSearch ?? [];
	const isSearching = debouncedSearch.trim().length > 2;
	const hasActiveFilter = Object.keys(queryFilterState ?? {}).length > 0;
	const showSkeleton = loading && notification.length === 0;
	const totalDocuments = metaData?.totalDocuments ?? courses.length;

	const renderBody = () => {
		if (showSkeleton) {
			return (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12'>
					{Array.from({ length: 8 }).map((_v, i) => (
						<CourseCardSkeleton key={i} />
					))}
				</div>
			);
		}

		if (isSearching) {
			return searchResults.length > 0 ? (
				<UserCoursesSection data={searchResults} />
			) : (
				<MyLearningEmpty variant='search' query={search} onClearSearch={clearSearch} />
			);
		}

		if (courses.length > 0) {
			return <UserCoursesSection data={courses} />;
		}

		if (hasActiveFilter) {
			return <MyLearningEmpty variant='filter' onClearFilters={clearFilters} />;
		}

		return <MyLearningEmpty variant='none' />;
	};

	return (
		<div className='mx-auto w-full max-w-container px-5 sm:px-8 lg:px-12 py-10 sm:py-16'>
			{/* Header */}
			<header className='border-b border-line-subtle pb-8'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					Library
				</span>
				<div className='mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
					<h1
						className='font-display font-semibold text-5xl leading-[1.02] tracking-[-0.03em] text-ink-primary'
						style={{ fontVariationSettings: '"opsz" 144' }}
					>
						My Learning
					</h1>
					{!isSearching && (
						<p className='font-body text-sm text-ink-secondary tabular-nums'>
							{totalDocuments > 0
								? `${totalDocuments} ${totalDocuments === 1 ? 'course' : 'courses'} on your shelf`
								: 'Pick up where you left off'}
						</p>
					)}
				</div>
			</header>

			{/* Controls */}
			<div className='mt-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
				<MyLearningFilters categories={category?.data} instructors={instructor?.data} />

				<div className='relative w-full lg:w-[320px] shrink-0'>
					<Search
						size={16}
						strokeWidth={1.8}
						className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary'
					/>
					<input
						type='search'
						name='search'
						aria-label='Search your library'
						placeholder='Search your library'
						value={search}
						onChange={handleSearch}
						className='h-11 w-full rounded-pill border border-line-base bg-bg-raised pl-11 pr-10 font-body text-sm text-ink-primary placeholder:text-ink-tertiary outline-none transition-colors focus:border-clay-500/60 [&::-webkit-search-cancel-button]:hidden'
					/>
					{search && (
						<button
							type='button'
							onClick={clearSearch}
							aria-label='Clear search'
							className='absolute right-3 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full text-ink-tertiary hover:text-ink-primary transition-colors'
						>
							<X size={15} strokeWidth={2} />
						</button>
					)}
				</div>
			</div>

			{/* Body */}
			<div className='mt-4'>{renderBody()}</div>

			{/* Pagination — only meaningful for the full (non-search) list */}
			{!isSearching && courses.length > 0 && (
				<div className='mt-6'>
					<Pagination
						metaData={metaData}
						handlePagination={handelQuerySearch}
						queryString={formQueryStr(queryFilterState)}
					/>
				</div>
			)}
		</div>
	);
};

export default MyLearning;
