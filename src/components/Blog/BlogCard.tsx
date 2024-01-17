import { FC } from 'react';
import WhiteBackground from '../WhiteBackground';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { blogCardType } from '../../pages/Home/types/homePageType';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';

const BlogCard: FC<blogCardType> = (props) => {
	const summary = (summary: string) => {
		return summary.length > 30 ? summary.slice(0, 80) + '...' : summary;
	};

	console.log(props.activeLayout);

	return (
		<WhiteBackground
			className={`rounded-b-none my-0 sm:my-3 w-full px-0 shadow-md hover:scale-105 duration-150 ${
				props.activeLayout === 'grid' ? 'sm:my-0' : 'my-5'
			}`}
		>
			<Link
				to='/articles/'
				className={`block hover:text-effect-active ${
					props.activeLayout === 'grid' ? 'block' : 'flex h-[11rem]'
				}`}
			>
				<figure
					className={` ${
						props.activeLayout === 'grid' ? 'h-[11rem]' : 'basis-[50%]'
					}`}
				>
					<img
						src={props.img}
						alt=''
						// className='rounded-t-lg h-full w-full object-cover'
						className={`${
							props.activeLayout === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'
						} h-full w-full object-cover`}
					/>
				</figure>
				<div
					className={`p-3 ${
						props.activeLayout === 'grid' ? 'basis-[50%]' : 'basis-full'
					}`}
				>
					<p className='text-lg font-bold my-1'>{props.articleTitle}</p>

					<div className='flex items-center gap-1'>
						<FaRegCalendarAlt className='fill-[#45A5CD]' />
						<span>{handleDateFormat(props.createdAt)}</span>
					</div>

					<div className='mt-1'>
						<p>{summary(props.summary)}</p>
					</div>
				</div>
			</Link>
		</WhiteBackground>
	);
};

export default BlogCard;
