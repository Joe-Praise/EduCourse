import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import FilterStructure from '../../components/shared/FilterStructure';
import FilterActionMenu from '../../components/shared/FilterActionMenu';
import BlogCard from '../../components/Blog/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/actions/courseAction';
import { AppDispatch, RootState } from '../../redux/store';
import { FaFilter } from 'react-icons/fa';
import { FilterType } from '../../components/shared/type';
import Pagination from '../../components/shared/Pagination';
import useDebounce from '../../hooks/UseDebounce';
import { getBlogsAction } from '../../redux/actions/blogAction';
import { formQueryStr } from '../../util/helperFunctions/helper';
import { paginateType } from '../../redux/sharedTypes';

const Blog: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const initializeRef = useRef(true);
	const blog = useSelector((state: RootState) => state.blog);
	const displayFilter = useSelector(
		(state: RootState) => state.course.filterState
	);
	const blogData = blog.blog;
	const queryFilterState = blog.queryFilter;

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
		// dispatch(getCategoryAction({ page: '1', limit: '0' }));
		// dispatch(getInstructorAction({ page: '1', limit: '0' }));
	}, [dispatch]);

	// interface cardProps {
	// 	img: string;
	// 	instructor: string;
	// 	articleTitle: string;
	// 	createdAt: string;
	// 	summary: string;
	// 	activeLayout: string;
	// }

	// const articles: cardProps[] = [
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		articleTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		summary:
	// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		articleTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		summary:
	// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		articleTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		summary:
	// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		articleTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		summary:
	// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		articleTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		summary:
	// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		articleTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		summary:
	// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
	// 		activeLayout,
	// 	},
	// 	{
	// 		img,
	// 		instructor: 'Joe Praise',
	// 		articleTitle: 'React and Redux master class',
	// 		createdAt: '1-01-2024',
	// 		summary:
	// 			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
	// 		activeLayout,
	// 	},
	// ];

	type tagType = { _id: string; name: string };

	interface overAll {
		Category: FilterType[];
		Tags: tagType[];
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
		Tags: [{ _id: '658aca7bf5797e2701fcbd28', name: 'Education' }],
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
							<BlogCard key={el._id} blog={el} activeLayout={el.activeLayout} />
						);
					})}
				</>
			}
			children2={
				<>
					{Object.entries(dataClone).map(([key, value], i) => {
						// console.log(key, value);
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
						metaData={blogData.metaData}
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
