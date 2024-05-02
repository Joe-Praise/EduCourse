// import { useEffect } from 'react';
import CardsPlaceholder from '../Home/CardsPlaceholder';
import BlogCard from './BlogCard';
// import { AppDispatch, RootState } from '../../redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { getBlogsAction } from '../../redux/actions/blogAction';
import { singleBlogType } from '../../redux/api/blogApi';
import BlogCardLoading from './BlogCardLoading';
import { LoadingPulse } from '../shared';

interface Iprop {
	blogs: singleBlogType[];
}
const Blogs = (props: Iprop) => {
	const { blogs } = props;

	const arr = Array.from({ length: 6 }, (_v, i) => i);
	const handleBlogDisplay = () => {
		if (!blogs) {
			return (
				<>
					{arr.map((_el, index) => (
						<LoadingPulse key={index}>
							<BlogCardLoading />
						</LoadingPulse>
					))}
				</>
			);
		} else {
			return (
				<>
					{blogs?.map((el: singleBlogType) => {
						return <BlogCard blog={el} key={el._id} activeLayout='grid' />;
					})}
				</>
			);
		}
	};

	return (
		<CardsPlaceholder
			title={'Articles'}
			description={'Explore our Free Articles'}
			path={`/blogs`}
			btnValue={'All Articles'}
			className='grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'
		>
			{handleBlogDisplay()}
		</CardsPlaceholder>
	);
};

export default Blogs;
