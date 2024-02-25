import WhiteBackground from '../shared/WhiteBackground';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
import { truncateValue } from '../../util/helperFunctions/helper';
import { singleBlogType } from '../../redux/api/blogApi';
import config from '../../../config';
interface Iprop {
	blog: singleBlogType;
	activeLayout: string;
}

const BlogCard = (props: Iprop) => {
	const { activeLayout, blog } = props;
	return (
		<WhiteBackground
			className={`rounded-b-none my-0 sm:my-3 w-full px-0 shadow-md hover:scale-105 duration-150 ${
				activeLayout === 'grid' ? 'sm:my-0' : 'my-5'
			}`}
		>
			<Link
				to='/blogs/data'
				className={`block hover:text-effect-active ${
					activeLayout === 'grid' ? 'block' : 'flex h-[11rem]'
				}`}
			>
				<figure
					className={` ${
						activeLayout === 'grid' ? 'h-[11rem]' : 'basis-[50%]'
					}`}
				>
					<img
						src={`${config.baseUrl}/blog/${blog?.imageCover}`}
						alt=''
						// className='rounded-t-lg h-full w-full object-cover'
						className={`${
							activeLayout === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'
						} h-full w-full object-cover`}
					/>
				</figure>
				<div
					className={`p-3 ${
						activeLayout === 'grid' ? 'basis-[50%]' : 'basis-full'
					}`}
				>
					<p className='text-lg font-bold my-1'>{blog.title}</p>

					<div className='flex items-center gap-1'>
						<FaRegCalendarAlt className='fill-[#45A5CD]' />
						<span>{handleDateFormat(blog.createdAt)}</span>
					</div>

					<div className='mt-1'>
						<p>{truncateValue(blog.summary, true, 100)}</p>
					</div>
				</div>
			</Link>
		</WhiteBackground>
	);
};

export default BlogCard;
