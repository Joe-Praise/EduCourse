import { FC } from 'react';
import WhiteBackground from '../WhiteBackground';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { articleCardType } from '../../pages/Home/model/homePageType';

const ArticleCard: FC<articleCardType> = (props) => {
	const summary = (summary: string) => {
		return summary.length > 30 ? summary.slice(0, 80) + '...' : summary;
	};
	return (
		<WhiteBackground className='rounded-b-none my-8 sm:my-3 w-full px-0 shadow-md hover:scale-105 duration-150'>
			<Link to='/articles/' className='block hover:text-effect-active'>
				<figure className='h-[14rem] w-full'>
					<img src={props.img} alt='' className='rounded-t-lg h-full w-full' />
				</figure>
				<div className='p-4'>
					<p className='text-lg font-bold my-1'>{props.articleTitle}</p>

					<div className='flex items-center'>
						<FaRegCalendarAlt className='fill-[#45A5CD]' />
						<span>{new Date(props.createdAt).toISOString()}</span>
					</div>

					<div className='mt-1'>
						<p>{summary(props.summary)}</p>
					</div>
				</div>
			</Link>
		</WhiteBackground>
	);
};

export default ArticleCard;
