import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import FilterStructure from '../../components/shared/FilterStructure';
import FilterActionMenu from '../../components/shared/FilterActionMenu';
import BlogCard from '../../components/Blog/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/actions/courseAction';
import { AppDispatch, RootState } from '../../redux/store';
import { FaFilter } from 'react-icons/fa';
import Pagination from '../../components/shared/Pagination';
import useDebounce from '../../hooks/UseDebounce';
import { getBlogsAction } from '../../redux/actions/blogAction';
import { formQueryStr } from '../../util/helperFunctions/helper';
import { paginateType } from '../../redux/sharedTypes';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { getTagAction } from '../../redux/actions/tagAction';
import { tagType } from '../../redux/api/tagApi';

const Blog: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const initializeRef = useRef(true);
	const blogState = useSelector((state: RootState) => state.blog);
	const category = useSelector((state: RootState) => state.category.categories);
	const tag = useSelector((state: RootState) => state.tag.tags);
	const displayFilter = useSelector(
		(state: RootState) => state.course.filterState
	);
	const blogData = blogState.blog;
	const metaData = blogState.blog.metaData;
	const queryFilterState = blogState.queryFilter;

	// TODO: CONTINUE FIXING UP THE STATES REQUIRED TO MAKE BLOG FUNCTION
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
		console.log(debouncedSearch);
	}, [debouncedSearch]);

	useEffect(() => {
		dispatch(getBlogsAction({ page: '1', limit }));
		dispatch(getCategoryAction({ page: '1', limit: '30' }, 'blog'));
		dispatch(getTagAction({ page: '1', limit: '30' }));
	}, [dispatch]);

	interface overAll {
		Category: OmittedCategoryDataType[];
		// Category: FilterType[];
		Tag: tagType[];
	}

	const dataClone: overAll = {
		Category: category?.data,
		Tag: tag?.data,
	};

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

	// handles Pagination dispatch
	const handelQuerySearch = (details: paginateType, queryString: string) => {
		dispatch(getBlogsAction(details, queryString));
	};

	useEffect(() => {}, [activeLayout, setActiveLayout]);
	return (
		<FilterStructure
			title={'Articles'}
			searchFunc={handleSearch}
			layoutFunc={handleLayoutChange}
			children1={
				<>
					{blogData?.data?.map((el: any) => {
						return (
							<BlogCard key={el._id} blog={el} activeLayout={activeLayout} />
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

export default Blog;
