import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, Loader, Check, ArrowUpRight } from 'lucide-react';
import { FilterActionMenu, Pagination } from '../../components/shared';
import {
	CourseCard,
	CourseCardSkeleton,
	type CourseCardData,
	type CourseCardSize,
} from '../../features/course';
import { Button } from '../../ui';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { FilterChipBar, type ActiveFilter } from '../../patterns/FilterChipBar/FilterChipBar';
import { RefineSheet } from '../../patterns/RefineSheet/RefineSheet';
import { Reveal } from '../../patterns/Reveal/Reveal';
import {
	getAutoCompleteAllCourseAction,
	getCoursesAction,
	removeQueryFilterAction,
	resetAutoCompleteAction,
	setQueryFilterAction,
} from '../../redux/actions/courseAction';
import { AppDispatch, RootState } from '../../redux/store';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { ratingSummaryType, triggerCourseImport } from '../../redux/api/courseAPI';
import { getInstructorAction } from '../../redux/actions/instructorAction';
import { OmittedInstructorDataType } from '../../redux/api/instructorApi';
import {
	addToWishlistAction,
	getWishlistAction,
	removeFromWishlistAction,
} from '../../redux/actions/wishlistAction';
import useDebounce from '../../hooks/UseDebounce';
import { formQueryStr } from '../../util/helperFunctions/helper';
import { autocompleteType, paginateType } from '../../redux/sharedTypes';
import { cn } from '../../lib/cn';

/** Size rhythm — produces an editorial gallery instead of a uniform grid. */
const sizeForIndex = (i: number): CourseCardSize => {
	if (i % 11 === 5) return 'feature';
	if (i % 7 === 3) return 'wide';
	return 'portrait';
};

const colSpanClass: Record<CourseCardSize, string> = {
	portrait: 'sm:col-span-3 lg:col-span-2',
	wide: 'sm:col-span-3 lg:col-span-3',
	feature: 'sm:col-span-6 lg:col-span-6',
};

const Course: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const initializeRef = useRef(true);
	const courseState = useSelector((state: RootState) => state.course);
	const category = useSelector((state: RootState) => state.category.categories);
	const instructor = useSelector((state: RootState) => state.instructor.instructors);
	const userId = useSelector((state: RootState) => state.user.userObj?._id);
	const wishlistMap = useSelector((state: RootState) => state.wishlist.wishlisted);
	const wishlistIds = useSelector((state: RootState) => state.wishlist.wishlistIds);

	const metaData = courseState.course.metaData;
	const queryFilterState = courseState.queryFilter as Record<string, string | number>;
	const coursesData = courseState.course;
	const autocomplete = courseState.autoComplete;

	const [search, setSearch] = useState('');
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const limit = '12';
	const debouncedSearch = useDebounce(search);

	// AI/YouTube course-build lifecycle for the current search term.
	type ImportState =
		| { status: 'idle' }
		| { status: 'building'; query: string; message: string }
		| { status: 'ready'; query: string; title: string; slug: string }
		| { status: 'error'; query: string };
	const [importState, setImportState] = useState<ImportState>({ status: 'idle' });
	const importPollRef = useRef<number | null>(null);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

	// Re-fetch the course grid for the currently-active filter. Called after an
	// AI import completes so the freshly-published course (sorted newest-first)
	// appears in the list without a manual refresh.
	const refreshCourses = useCallback(() => {
		const params = new URLSearchParams(location.search);
		const categoryId = params.get('category');
		const queryStr = categoryId ? `?category=${encodeURIComponent(categoryId)}` : '';
		dispatch(getCoursesAction({ page: '1', limit }, queryStr));
	}, [dispatch, location.search, limit]);

	// Stop any in-flight import poll on unmount.
	useEffect(() => () => {
		if (importPollRef.current) window.clearTimeout(importPollRef.current);
	}, []);

	const handleBuildCourse = async (query: string) => {
		const q = query.trim();
		if (q.length < 3) return;
		setImportState({ status: 'building', query: q, message: `Searching YouTube for "${q}"…` });

		const resp = await triggerCourseImport(q);
		if (resp && 'error' in resp && resp.error) {
			setImportState({ status: 'error', query: q });
			return;
		}
		const r = resp as Awaited<ReturnType<typeof triggerCourseImport>>;
		setImportState({
			status: 'building',
			query: q,
			message:
				(r as { discoveryMessage?: string }).discoveryMessage ??
				`Building "${q}" from YouTube — this takes ~30s.`,
		});

		// Poll until the course is published (importing → published), max ~3min.
		let tries = 0;
		const poll = async () => {
			tries += 1;
			const res = await triggerCourseImport(q);
			const data = (res as { data?: Array<{ title: string; slug: string; publishedStatus?: string }> })?.data ?? [];
			const importing = (res as { importing?: boolean })?.importing;
			const match = data.find((c) => c.publishedStatus === 'published') ?? data[0];

			if (match && match.publishedStatus === 'published') {
				setImportState({ status: 'ready', query: q, title: match.title, slug: match.slug });
				refreshCourses();
				return;
			}
			if (!importing && match) {
				setImportState({ status: 'ready', query: q, title: match.title, slug: match.slug });
				refreshCourses();
				return;
			}
			if (tries >= 26) {
				setImportState({ status: 'error', query: q });
				return;
			}
			importPollRef.current = window.setTimeout(poll, 7000);
		};
		importPollRef.current = window.setTimeout(poll, 7000);
	};

	useEffect(() => {
		// New query → clear any stale build banner (unless it's the one building).
		setImportState((prev) =>
			prev.status !== 'idle' && prev.query !== debouncedSearch.trim()
				? { status: 'idle' }
				: prev,
		);
		if (debouncedSearch.length <= 2) {
			dispatch(resetAutoCompleteAction());
			return;
		}
		dispatch(getAutoCompleteAllCourseAction(debouncedSearch));
	}, [dispatch, debouncedSearch]);

	const skipNextUrlSyncRef = useRef(false);

	useEffect(() => {
		// If WE just wrote the URL (from a chip removal), skip re-reading it.
		if (skipNextUrlSyncRef.current) {
			skipNextUrlSyncRef.current = false;
			return;
		}
		const params = new URLSearchParams(location.search);
		const categoryId = params.get('category');
		if (categoryId) {
			dispatch(setQueryFilterAction({ Category: categoryId }));
		}
		const queryStr = categoryId ? `?category=${encodeURIComponent(categoryId)}` : '';
		dispatch(getCoursesAction({ page: '1', limit }, queryStr));
		dispatch(getCategoryAction({ page: '1', limit: '30' }, 'course'));
		dispatch(getInstructorAction({ page: '1', limit: '10' }));
	}, [dispatch, location.search]);

	// State → URL sync. When the user removes the Category chip (or it changes
	// via the filter menu), the URL is kept in step so the page is bookmarkable
	// and a refresh resurrects the right filter — not a stale one.
	useEffect(() => {
		const currentParams = new URLSearchParams(location.search);
		const urlCategory = currentParams.get('category');
		const stateCategory = (queryFilterState as Record<string, string>).Category;

		if (stateCategory && stateCategory !== urlCategory) {
			skipNextUrlSyncRef.current = true;
			navigate(`/courses?category=${encodeURIComponent(stateCategory)}`, { replace: true });
		} else if (!stateCategory && urlCategory) {
			skipNextUrlSyncRef.current = true;
			navigate('/courses', { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryFilterState]);

	useEffect(() => {
		if (userId) dispatch(getWishlistAction(userId));
	}, [dispatch, userId]);

	const handleToggleWishlist = (courseId: string) => {
		if (!userId) {
			navigate('/signin');
			return;
		}
		if (wishlistMap[courseId] && wishlistIds[courseId]) {
			dispatch(removeFromWishlistAction(wishlistIds[courseId], courseId));
		} else if (!wishlistMap[courseId]) {
			dispatch(addToWishlistAction(userId, courseId));
		}
	};

	type priceCategory = { _id: string; name: 'Free' | 'Paid' };
	type level = { _id: string; name: string };
	type reviewType = ratingSummaryType & { _id: number };

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
		Level: [
			{ _id: 'All Levels', name: 'All Levels' },
			{ _id: 'Beginner', name: 'Beginner' },
			{ _id: 'Intermediate', name: 'Intermediate' },
			{ _id: 'Advanced', name: 'Advanced' },
		],
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

	const handelQuerySearch = (details: paginateType, queryString: string) => {
		dispatch(getCoursesAction(details, queryString));
	};

	const handleAutocompleteSelect = (course: autocompleteType) => {
		const slug = course?.slug;
		navigate(`${location.pathname}/${slug}`);
	};

	const activeFilterChips = useMemo<ActiveFilter[]>(() => {
		return Object.entries(queryFilterState)
			.filter(([, value]) => value !== '' && value !== undefined && value !== null)
			.map(([key, value]) => {
				const raw = String(value);
				let displayValue = raw;
				if (key === 'Category') {
					const match = category?.data?.find((c: OmittedCategoryDataType) => c._id === raw);
					displayValue = match?.name ?? raw;
				} else if (key === 'Instructors') {
					const match = instructor?.data?.find((i: OmittedInstructorDataType) => i._id === raw);
					displayValue = match?.userId?.name ?? raw;
				}
				return {
					key,
					label: `${key}: ${displayValue}`,
					onRemove: () => dispatch(removeQueryFilterAction({ [key]: '' })),
				};
			});
	}, [queryFilterState, dispatch, category, instructor]);

	const handleClearAll = () => {
		activeFilterChips.forEach((chip) => chip.onRemove());
	};

	const filterPanels = (
		<div className='flex flex-col'>
			{Object.entries(filterData).map(([key, value], i) => (
				<FilterActionMenu header={key} values={value} key={i} />
			))}
		</div>
	);

	const skeletons = Array.from({ length: 9 }, (_v, i) => i);
	const isLoading = !coursesData?.data || coursesData.data.length < 1;
	const data = (coursesData?.data ?? []) as CourseCardData[];
	const total = metaData?.totalDocuments ?? data.length;

	return (
		<>
			<PageLayout width='default' className='pt-16 sm:pt-24 pb-12'>
				{/* Editorial header */}
				<div className='mb-12 sm:mb-16 max-w-3xl'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						The catalog · {total.toLocaleString()} courses
					</span>
					<Reveal
						mode='word-split'
						as='h1'
						className='mt-5 font-display font-semibold text-5xl sm:text-6xl lg:text-7xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
					>
						Browse the work.
					</Reveal>
					<p className='mt-6 font-body text-lg text-ink-secondary leading-[1.6] max-w-xl'>
						Twelve thousand lessons across eighty fields. Filter by what you
						actually want to learn — not by what&apos;s trending.
					</p>
				</div>

				{/* Floating filter rail */}
				<div className='sticky top-4 z-30 mb-10'>
					<div className='glass rounded-pill px-2 py-2 flex items-center gap-2 max-w-2xl mx-auto shadow-warm-2'>
						<button
							type='button'
							onClick={() => setSearchOpen((v) => !v)}
							aria-label='Search courses'
							data-cursor='grow'
							className='inline-grid place-items-center h-10 w-10 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors'
						>
							<Search size={16} strokeWidth={2} />
						</button>
						<input
							type='text'
							placeholder='Search the catalog…'
							value={search}
							onChange={handleSearch}
							onFocus={() => setSearchOpen(true)}
							onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
							className={cn(
								'flex-1 bg-transparent outline-none text-ink-primary placeholder:text-ink-tertiary font-body text-sm',
								searchOpen ? 'opacity-100' : 'opacity-90',
							)}
						/>
						<div className='h-6 w-px bg-line-base' aria-hidden />
						<button
							type='button'
							onClick={() => setMobileFilterOpen(true)}
							className='inline-flex items-center gap-2 h-10 px-4 rounded-pill text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors font-body text-sm'
						>
							<SlidersHorizontal size={14} strokeWidth={2} />
							<span>Refine</span>
						</button>
					</div>

					{/* Search dropdown — results, importing badges, + build-from-YouTube */}
					{searchOpen && debouncedSearch.trim().length >= 3 && (
						<div className='mt-2 max-w-2xl mx-auto rounded-card glass-strong shadow-warm-3 overflow-hidden'>
							{/* Matching courses */}
							{autocomplete && autocomplete.length > 0 && (
								<ul className='py-2 max-h-72 overflow-y-auto border-b border-line-subtle'>
									{autocomplete.slice(0, 8).map((c: autocompleteType) => {
										const building = c.publishedStatus === 'importing';
										return (
											<li key={c._id}>
												<button
													type='button'
													disabled={building}
													onMouseDown={(e) => {
														e.preventDefault();
														if (!building) handleAutocompleteSelect(c);
													}}
													className={cn(
														'w-full text-left px-5 py-2.5 text-sm transition-colors flex items-center justify-between gap-3',
														building
															? 'text-ink-tertiary cursor-default'
															: 'text-ink-secondary hover:bg-clay-500/10 hover:text-ink-primary',
													)}
												>
													<span className='truncate'>{c.title}</span>
													{building && (
														<span className='shrink-0 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.18em] text-clay-400'>
															<Loader size={11} strokeWidth={2} className='animate-spin' />
															Building
														</span>
													)}
												</button>
											</li>
										);
									})}
								</ul>
							)}

							{/* Build-from-YouTube zone */}
							<div className='px-5 py-3'>
								{importState.status === 'building' ? (
									<div className='flex items-start gap-3'>
										<Loader size={15} strokeWidth={2} className='mt-0.5 text-clay-400 animate-spin shrink-0' />
										<div className='min-w-0'>
											<p className='font-body text-sm text-ink-primary'>{importState.message}</p>
											<p className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary mt-1'>
												Building from YouTube · stay on this page
											</p>
										</div>
									</div>
								) : importState.status === 'ready' ? (
									<button
										type='button'
										onMouseDown={(e) => {
											e.preventDefault();
											navigate(`/courses/${importState.slug}`);
										}}
										className='w-full flex items-center justify-between gap-3 text-left group'
									>
										<span className='flex items-center gap-2 min-w-0'>
											<Check size={15} strokeWidth={2.5} className='text-signal-success shrink-0' />
											<span className='font-body text-sm text-ink-primary truncate'>
												&ldquo;{importState.title}&rdquo; is ready
											</span>
										</span>
										<ArrowUpRight size={14} strokeWidth={2} className='text-clay-400 shrink-0 group-hover:translate-x-0.5 transition-transform' />
									</button>
								) : importState.status === 'error' ? (
									<div className='flex items-center justify-between gap-3'>
										<p className='font-body text-sm text-ink-tertiary'>
											Couldn&apos;t build that one. Try a different phrasing.
										</p>
										<button
											type='button'
											onMouseDown={(e) => { e.preventDefault(); handleBuildCourse(debouncedSearch); }}
											className='shrink-0 font-mono text-2xs uppercase tracking-[0.18em] text-clay-400 hover:text-clay-500'
										>
											Retry
										</button>
									</div>
								) : (
									<button
										type='button'
										onMouseDown={(e) => { e.preventDefault(); handleBuildCourse(debouncedSearch); }}
										className='w-full flex items-center gap-2.5 text-left group'
									>
										<span className='inline-grid place-items-center h-7 w-7 rounded-full bg-clay-500/15 text-clay-400 shrink-0'>
											<Sparkles size={14} strokeWidth={2} />
										</span>
										<span className='min-w-0'>
											<span className='block font-body text-sm text-ink-primary'>
												{autocomplete && autocomplete.length > 0
													? `Not quite it? Build "${debouncedSearch}" from YouTube`
													: `No match — build "${debouncedSearch}" from YouTube`}
											</span>
											<span className='block font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary mt-0.5'>
												AI imports a course in ~30s
											</span>
										</span>
									</button>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Active chips */}
				{activeFilterChips.length > 0 && (
					<FilterChipBar
						chips={activeFilterChips}
						onClearAll={handleClearAll}
						className='mb-8'
					/>
				)}

				{/* Editorial gallery — asymmetric masonry */}
				<div className='grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-6 auto-rows-auto gap-6 sm:gap-8'>
					{isLoading
						? skeletons.map((idx) => (
							<div key={idx} className={colSpanClass[sizeForIndex(idx)]}>
								<CourseCardSkeleton />
							</div>
						))
						: data.length === 0
							? (
								<div className='sm:col-span-6 py-24 grid place-items-center text-center'>
									<div className='max-w-md'>
										<h3 className='font-display font-semibold text-3xl text-ink-primary'>No matches.</h3>
										<p className='mt-3 font-body text-sm text-ink-tertiary'>
											Try clearing some filters or search a different term.
										</p>
										{activeFilterChips.length > 0 && (
											<button
												type='button'
												onClick={handleClearAll}
												className='mt-6 inline-flex items-center h-10 px-5 rounded-pill border border-line-base text-ink-primary hover:border-line-strong transition-colors font-body text-sm'
											>
												Clear all filters
											</button>
										)}
									</div>
								</div>
							)
							: data.map((course, idx) => {
								const size = sizeForIndex(idx);
								return (
									<div key={course._id} className={colSpanClass[size]}>
										<CourseCard
											course={course}
											size={size}
											priority={idx < 3}
											wishlisted={!!wishlistMap[course._id]}
											onToggleWishlist={() => handleToggleWishlist(course._id)}
										/>
									</div>
								);
							})}
				</div>

				<div className='mt-16'>
					<Pagination
						metaData={metaData}
						handlePagination={handelQuerySearch}
						queryString={queryFilterState as unknown as string}
					/>
				</div>
			</PageLayout>

			<RefineSheet
				open={mobileFilterOpen}
				onClose={() => setMobileFilterOpen(false)}
				title='Refine the catalog'
			>
				{/* Active summary + clear all */}
				{activeFilterChips.length > 0 && (
					<div className='flex items-center justify-between pb-3 mb-1 border-b border-line-subtle'>
						<span className='font-mono text-2xs uppercase tracking-[0.2em] text-clay-400'>
							{activeFilterChips.length} active
						</span>
						<button
							type='button'
							onClick={handleClearAll}
							className='font-body text-xs text-ink-tertiary hover:text-ink-primary transition-colors'
						>
							Clear all
						</button>
					</div>
				)}
				{filterPanels}
				<div className='mt-6'>
					<Button variant='primary' fullWidth onClick={() => setMobileFilterOpen(false)}>
						View {total.toLocaleString()} results
					</Button>
				</div>
			</RefineSheet>
		</>
	);
};

export default Course;
