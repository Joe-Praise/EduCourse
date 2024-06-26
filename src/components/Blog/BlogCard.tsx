import { WhiteBackground } from '../shared';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
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
			className={` my-0 w-full px-0 hover:scale-105 duration-150 h-full ${
				activeLayout === 'grid' ? 'sm:my-0' : 'my-5'
			}`}
		>
			<Link
				to={`/blogs/${blog.slug}`}
				className={`flex hover:text-effect-active ${
					activeLayout === 'grid' ? ' flex-col' : 'flex-row  md:h-[11rem]'
				}`}
			>
				<div
					className={`relative ${
						activeLayout === 'grid' ? 'pb-[12rem]' : 'pr-[8rem] md:pr-[14rem]'
					}`}
				>
					<figure
						className={` ${
							activeLayout === 'grid' ? 'h-full' : 'basis-[50%] h-full'
						}`}
					>
						<img
							src={`${config.baseUrl}/blog/${blog?.imageCover}`}
							alt={`${blog?.title}'s cover image`}
							loading='lazy'
							className={`absolute top-0 w-full object-cover object-bottom ${
								activeLayout === 'grid'
									? 'rounded-t-lg h-48'
									: 'rounded-l-lg h-full'
							}`}
						/>
					</figure>
				</div>
				<div
					className={`p-3 ${
						activeLayout === 'grid'
							? 'basis-[50%]'
							: 'basis-full flex justify-between flex-col'
					}`}
				>
					<p className='text-lg font-bold my-1'>
						{truncateValue(blog?.title, true, 28)}
					</p>

					<div className='flex items-center gap-1'>
						<FaRegCalendarAlt className='fill-[#45A5CD]' />
						<span>{blog.createdAt}</span>
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
