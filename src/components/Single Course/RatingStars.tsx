import { FaStar } from 'react-icons/fa6';

interface Iprop {
	rating: string;
}

const RatingStars = (props: Iprop) => {
	const { rating } = props;
	const arr = [1, 2, 3, 4, 5];
	return (
		<div className='flex items-center gap-[2px]'>
			{arr.map((_, idx) => {
				/**
				 * TODO: Fix the bug here on the render of stars
				 */
				return (
					<FaStar
						key={idx}
						className={`${
							idx < parseInt(rating) ? 'fill-orange-400' : ''
						} h-3 w-3`}
					/>
				);
			})}
		</div>
	);
};

export default RatingStars;
