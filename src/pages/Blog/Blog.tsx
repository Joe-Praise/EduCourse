import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterActionMenu, Pagination } from '../../components/shared';
import { BlogCard, type BlogCardData } from '../../features/blog';
import { Button } from '../../ui';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { FilterChipBar, type ActiveFilter } from '../../patterns/FilterChipBar/FilterChipBar';
import { RefineSheet } from '../../patterns/RefineSheet/RefineSheet';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { AppDispatch, RootState } from '../../redux/store';
import {
	getAutoCompleteAllBlogAction,
	getBlogsAction,
	removeBlogQueryFilterAction,
	resetAutoCompleteAction,
	setBlogQueryFilterAction,
} from '../../redux/actions/blogAction';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { getTagAction } from '../../redux/actions/tagAction';
import { tagType } from '../../redux/api/tagApi';
import { autocompleteType, paginateType } from '../../redux/sharedTypes';
import { formQueryStr } from '../../util/helperFunctions/helper';
import useDebounce from '../../hooks/UseDebounce';
import { cn } from '../../lib/cn';

type BlogCardVariant = 'featured' | 'default';

const variantForIndex = (i: number): BlogCardVariant =>
	i === 0 || i % 7 === 4 ? 'featured' : 'default';

const colSpanClass: Record<BlogCardVariant, string> = {
	featured: 'sm:col-span-6',
	default: 'sm:col-span-3 lg:col-span-2',
};

const BlogCardSkeleton = ({ featured }: { featured?: boolean }) => (
	<div
		className={cn(
			'animate-pulse rounded-card bg-bg-raised',
			featured ? 'aspect-[21/9]' : 'aspect-[16/10]',
		)}
	/>
);

const Blog: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const initializeRef = useRef(true);

	const blogState = useSelector((state: RootState) => state.blog);
	const category = useSelector((state: RootState) => state.category.categories);
	const tag = useSelector((state: RootState) => state.tag.tags);

	const blogData = blogState.blog;
	const metaData = blogState.blog.metaData;
	const queryFilterState = blogState.queryFilter as Record<string, string>;
	const autocomplete = blogState.autoComplete;

	const [search, setSearch] = useState('');
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const limit = '12';
	const debouncedSearch = useDebounce(search);

	useEffect(() => {
		if (debouncedSearch.length <= 2) {
			dispatch(resetAutoCompleteAction());
			return;
		}
		dispatch(getAutoCompleteAllBlogAction(debouncedSearch));
	}, [dispatch, debouncedSearch]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const categoryId = params.get('category');
		const tagId = params.get('tag');
		const initial: Record<string, string> = {};
		if (categoryId) initial.Category = categoryId;
		if (tagId) initial.Tag = tagId;
		const queryStr = Object.keys(initial).length > 0 ? formQueryStr(initial) : '';
		if (Object.keys(initial).length > 0) {
			dispatch(setBlogQueryFilterAction(initial));
		}
		dispatch(getBlogsAction({ page: '1', limit }, queryStr));
		dispatch(getCategoryAction({ page: '1', limit: '30' }, 'blog'));
		dispatch(getTagAction({ page: '1', limit: '30' }));
	}, [dispatch, location.search]);

	useEffect(() => {
		if (initializeRef.current) {
			initializeRef.current = false;
			return;
		}
		const timeout = setTimeout(() => {
			const queryStr = formQueryStr(queryFilterState);
			dispatch(getBlogsAction({ page: '1', limit }, queryStr));
		}, 700);
		return () => clearTimeout(timeout);
	}, [dispatch, queryFilterState]);

	const handelQuerySearch = (details: paginateType, queryString: string) => {
		dispatch(getBlogsAction(details, queryString));
	};

	const handleAutocompleteSelect = (blog: autocompleteType) => {
		navigate(`${location.pathname}/${blog?.slug}`);
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
				} else if (key === 'Tag') {
					const match = tag?.data?.find((t: tagType) => t._id === raw);
					displayValue = match?.name ?? raw;
				}
				return {
					key,
					label: `${key}: ${displayValue}`,
					onRemove: () => dispatch(removeBlogQueryFilterAction({ [key]: '' })),
				};
			});
	}, [queryFilterState, dispatch, category, tag]);

	const handleClearAll = () => {
		activeFilterChips.forEach((chip) => chip.onRemove());
	};

	interface FilterData {
		Category: OmittedCategoryDataType[];
		Tag: tagType[];
	}

	const filterData: FilterData = {
		Category: category?.data,
		Tag: tag?.data,
	};

	const filterPanels = (
		<div className='flex flex-col gap-2'>
			{Object.entries(filterData).map(([key, value], i) => (
				<FilterActionMenu header={key} values={value} key={i} />
			))}
		</div>
	);

	const isLoading = !blogData?.data || blogData.data.length < 1;
	const data = (blogData?.data ?? []) as BlogCardData[];
	const total = metaData?.totalDocuments ?? data.length;
	const skeletons = Array.from({ length: 9 }, (_, i) => i);

	return (
		<>
			<PageLayout width='default' className='pt-16 sm:pt-24 pb-12'>
				{/* Editorial header */}
				<div className='mb-12 sm:mb-16 max-w-3xl'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						The archive · {total.toLocaleString()} articles
					</span>
					<Reveal
						mode='word-split'
						as='h1'
						className='mt-5 font-display font-semibold text-5xl sm:text-6xl lg:text-7xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
					>
						Craft. Thinking. Practice.
					</Reveal>
					<p className='mt-6 font-body text-lg text-ink-secondary leading-[1.6] max-w-xl'>
						Essays and guides from people who are actually doing the work —
						no hot takes, no filler.
					</p>
				</div>

				{/* Floating filter rail */}
				<div className='sticky top-4 z-30 mb-10'>
					<div className='glass rounded-pill px-2 py-2 flex items-center gap-2 max-w-2xl mx-auto shadow-warm-2'>
						<button
							type='button'
							onClick={() => setSearchOpen((v) => !v)}
							aria-label='Search articles'
							data-cursor='grow'
							className='inline-grid place-items-center h-10 w-10 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors'
						>
							<Search size={16} strokeWidth={2} />
						</button>
						<input
							type='text'
							placeholder='Search articles…'
							value={search}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
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

					{/* Autocomplete dropdown */}
					{searchOpen && autocomplete && autocomplete.length > 0 && (
						<div className='mt-2 max-w-2xl mx-auto rounded-card glass-strong shadow-warm-3 overflow-hidden'>
							<ul className='py-2 max-h-72 overflow-y-auto'>
								{autocomplete.slice(0, 8).map((b: autocompleteType) => (
									<li key={b._id}>
										<button
											type='button'
											onMouseDown={(e) => {
												e.preventDefault();
												handleAutocompleteSelect(b);
											}}
											className='w-full text-left px-5 py-2.5 text-sm text-ink-secondary hover:bg-clay-500/10 hover:text-ink-primary transition-colors'
										>
											{b.title}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				{/* Active filter chips */}
				{activeFilterChips.length > 0 && (
					<FilterChipBar
						chips={activeFilterChips}
						onClearAll={handleClearAll}
						className='mb-8'
					/>
				)}

				{/* Asymmetric editorial grid */}
				<div className='grid grid-cols-1 sm:grid-cols-6 gap-6 sm:gap-8'>
					{isLoading
						? skeletons.map((idx) => (
								<div key={idx} className={colSpanClass[variantForIndex(idx)]}>
									<BlogCardSkeleton featured={variantForIndex(idx) === 'featured'} />
								</div>
						))
						: data.length === 0
						? (
							<div className='sm:col-span-6 py-24 grid place-items-center text-center gap-3'>
								<h3 className='font-display font-semibold text-3xl text-ink-primary'>
									No articles found.
								</h3>
								<p className='font-body text-sm text-ink-tertiary'>
									Try clearing some filters or searching a different term.
								</p>
								{activeFilterChips.length > 0 && (
									<button
										type='button'
										onClick={handleClearAll}
										className='mt-4 inline-flex items-center h-10 px-5 rounded-pill border border-line-base text-ink-primary hover:border-line-strong transition-colors font-body text-sm'
									>
										Clear all filters
									</button>
								)}
							</div>
						)
						: data.map((blog, idx) => {
								const variant = variantForIndex(idx);
								return (
									<div key={blog._id} className={colSpanClass[variant]}>
										<BlogCard blog={blog} variant={variant} />
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
				title='Refine articles'
			>
				{filterPanels}
				<div className='mt-6'>
					<Button variant='primary' fullWidth onClick={() => setMobileFilterOpen(false)}>
						View {total.toLocaleString()} articles
					</Button>
				</div>
			</RefineSheet>
		</>
	);
};

export default Blog;
