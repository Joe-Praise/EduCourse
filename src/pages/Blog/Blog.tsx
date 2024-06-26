import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import {
	FilterActionMenu,
	FilterStructure,
	Pagination,
} from '../../components/shared';
import { BlogCard } from '../../components/Blog';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/actions/courseAction';
import { AppDispatch, RootState } from '../../redux/store';
import { FaFilter } from 'react-icons/fa';
import useDebounce from '../../hooks/UseDebounce';
import {
	getAutoCompleteAllBlogAction,
	getBlogsAction,
	resetAutoCompleteAction,
} from '../../redux/actions/blogAction';
import { formQueryStr } from '../../util/helperFunctions/helper';
import { autocompleteType, paginateType } from '../../redux/sharedTypes';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { getTagAction } from '../../redux/actions/tagAction';
import { tagType } from '../../redux/api/tagApi';
import { useLocation, useNavigate } from 'react-router-dom';

const Blog: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
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
	const autocomplete = blogState.autoComplete;

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

		dispatch(getAutoCompleteAllBlogAction(debouncedSearch));
	}, [dispatch, debouncedSearch]);

	useEffect(() => {
		dispatch(getBlogsAction({ page: '1', limit }));
		dispatch(getCategoryAction({ page: '1', limit: '30' }, 'blog'));
		dispatch(getTagAction({ page: '1', limit: '30' }));
	}, [dispatch]);

	interface overAll {
		Category: OmittedCategoryDataType[];
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

	const handleRedirectFunc = (blog: autocompleteType) => {
		const slug = blog?.slug;
		navigate(`${location.pathname}/${slug}`);
	};

	useEffect(() => {}, [activeLayout, setActiveLayout]);
	return (
		<FilterStructure
			title={'Articles'}
			searchFunc={handleSearch}
			autocomplete={autocomplete}
			redirectFunc={handleRedirectFunc}
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
