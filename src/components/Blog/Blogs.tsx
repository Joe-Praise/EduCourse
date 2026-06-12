import CardsPlaceholder from '../Home/CardsPlaceholder';
import { BlogCard, type BlogCardData } from '../../features/blog';
import { CourseCardSkeleton } from '../../features/course';
import { singleBlogType } from '../../redux/api/blogApi';

interface Iprop {
	blogs: singleBlogType[];
}
const Blogs = (props: Iprop) => {
	const { blogs } = props;

	const skeletons = Array.from({ length: 6 }, (_v, i) => i);
	const handleBlogDisplay = () => {
		if (!blogs) {
			return (
				<>
					{skeletons.map((idx) => (
						<CourseCardSkeleton key={idx} />
					))}
				</>
			);
		}
		return (
			<>
				{blogs.map((el: singleBlogType) => (
					<BlogCard blog={el as unknown as BlogCardData} key={el._id} />
				))}
			</>
		);
	};

	return (
		<CardsPlaceholder
			title={'Articles'}
			description={'Explore our Free Articles'}
			path={`/blogs`}
			btnValue={'All Articles'}
			className='grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'
		>
			{handleBlogDisplay()}
		</CardsPlaceholder>
	);
};

export default Blogs;
