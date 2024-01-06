import { FC } from 'react';
// import WhiteBackground from '../WhiteBackground';
import { topCategoryCardType } from '../../pages/Home/types/homePageType';

const TopCategoryCard: FC<topCategoryCardType> = (props) => {
	return (
		<div className='my-2 sm:my-0 h-[7.5rem] w-full px-0 shadow-lg hover:scale-105 duration-150 rounded-lg'>
			<div className='hover:text-effect-active flex flex-col items-center justify-center h-full'>
				<p className='text-sm font-bold my-1'>{props.title}</p>
				<p>
					{+props.total.length > 1
						? props.total + ' Courses'
						: props.total + ' Course'}
				</p>
			</div>
		</div>
	);
};

export default TopCategoryCard;
