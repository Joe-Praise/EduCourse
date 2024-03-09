import { Line } from 'rc-progress';
import RatingStars from '../Single Course/RatingStars';

interface ratingSummary {
	title: string;
	value: number;
}

interface Iprop {
	rating: string;
	percentage: ratingSummary[];
}

/**
 *
 * @param props
 *  rating is the overall percentage rating value
 * percentage is an array of percentage based on the total number of overall stars (1star -5 stars)
 * @returns
 */

const RatingStarsContainer = (props: Iprop) => {
	const { rating, percentage } = props;

	return (
		<div className='md:flex items-center gap-2'>
			<div className=' gap-2 items-center'>
				<h1 className='text-5xl'>
					{rating.length < 1
						? parseInt(rating).toFixed(1)
						: parseFloat(rating).toFixed(1)}
				</h1>
				<div>
					<RatingStars rating={rating} />
					<p className='text-xs text-wrap'>Course rating</p>
				</div>
			</div>
			<div className='w-100 bg-green- flex-1 '>
				{percentage?.map((el, idx) => {
					return (
						<div
							className='flex items-center justify-between gap-2 md:gap-3'
							key={idx}
						>
							<div className={`basis-[65%] md:basis-9/12`}>
								<Line
									percent={el?.value}
									strokeWidth={1}
									strokeColor='#fb923c'
								/>
							</div>
							<div className='flex basis-[35%] gap-1 md:basis-[30%] flex-wrap justify-start'>
								<RatingStars rating={el?.title} />
								<p>{Math.floor(el?.value)}%</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RatingStarsContainer;
