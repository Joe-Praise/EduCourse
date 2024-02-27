import { FC, useEffect } from 'react';
import CardsPlaceholder from '../Home/CardsPlaceholder';
import BlogCard from './BlogCard';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogsAction } from '../../redux/actions/blogAction';
import { singleBlogType } from '../../redux/api/blogApi';

const Blogs: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const blogData = useSelector((state: RootState) => state.blog.blog);

	useEffect(() => {
		dispatch(getBlogsAction({ page: '1', limit: '6' }));
	}, [dispatch]);

	return (
		<CardsPlaceholder
			title={'Articles'}
			description={'Explore our Free Articles'}
			path={`/blogs`}
			btnValue={'All Articles'}
			className='grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'
		>
			<>
				{blogData?.data?.map((el: singleBlogType) => {
					return <BlogCard blog={el} key={el._id} activeLayout='grid' />;
				})}
			</>
		</CardsPlaceholder>
	);
};

export default Blogs;
