import { ChangeEvent, FC, useEffect, useState } from 'react';
import img from '../../../assets/image/card4.jpg';
import FilterStructure from '../../../components/shared/FilterStructure';
import FilterActionMenu from '../../../components/shared/FilterActionMenu';
import BlogCard from '../../../components/Blog/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
// import { setFilter } from '../../../redux/reducers/courseSlice';
import { setFilter } from '../../../redux/actions/courseAction';
import { RootState } from '../../../redux/store';
import { FaFilter } from 'react-icons/fa';

const Blog: FC = () => {
	const dispatch = useDispatch();
	const displayFilter = useSelector(
		(state: RootState) => state.course.filterState
	);

	const [activeLayout, setActiveLayout] = useState('grid');

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
	};

	const handleLayoutChange = (value: string) => {
		setActiveLayout(value);
	};

	const handleCloseFilterOnMobile = () => {
		dispatch(setFilter());
	};

	interface cardProps {
		img: string;
		instructor: string;
		articleTitle: string;
		createdAt: string;
		summary: string;
		activeLayout: string;
	}

	const articles: cardProps[] = [
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout,
		},
		{
			img,
			instructor: 'Joe Praise',
			articleTitle: 'React and Redux master class',
			createdAt: '1-01-2024',
			summary:
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ipsa! Aperiam distinctio sit consectetur dolorem, id odit aspernatur facere architecto delectus, eligendi assumenda nihil non unde. Nobis magni suscipit non eligendi natus ea, accusantium earum, delectus incidunt reiciendis asperiores qui.',
			activeLayout,
		},
	];

	const arr2 = Array.from(Array(5), () => 0);
	useEffect(() => {}, [activeLayout, setActiveLayout]);
	return (
		<FilterStructure
			title={'All Blogs'}
			searchFunc={handleSearch}
			layoutFunc={handleLayoutChange}
			children1={
				<>
					{articles.map((el, i) => {
						return (
							<BlogCard
								key={i}
								img={el.img}
								articleTitle={el.articleTitle}
								createdAt={el.createdAt}
								summary={el.summary}
								instructor={el.instructor}
								activeLayout={el.activeLayout}
							/>
						);
					})}
				</>
			}
			children2={
				<>
					{arr2.map((_, i) => {
						return <FilterActionMenu header={'Courses Category'} key={i} />;
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

export default Blog;
