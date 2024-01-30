import { Line } from 'rc-progress';
import RatingStars from '../Single Course/RatingStars';

interface Iprop {
	rating: string;
	percentage: number[];
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

	// const arr2 = Array.from(Array(5), () => 0);
	// const arr = [1, 2, 3, 4, 5];
	return (
		<div className='md:flex items-center gap-2'>
			<div className=' gap-2 items-center'>
				<h1 className='text-5xl'>{parseInt(rating).toFixed(1)}</h1>
				<div>
					<RatingStars rating={rating} />
					<p className='text-xs text-wrap'>Course rating</p>
				</div>
			</div>
			<div className='w-100 bg-green- flex-1 '>
				{percentage.map((el, idx) => {
					// const dynamicWidth = el ? `${el}%` : '0%';
					return (
						<div
							className='flex items-center justify-between gap-2 md:gap-3'
							key={idx}
						>
							<div className={`basis-[65%] md:basis-10/12`}>
								<Line percent={el} strokeWidth={1} strokeColor='#fb923c' />
							</div>
							<div className='flex basis-[35%] gap-1 md:basis-[20%] flex-wrap justify-start'>
								{/**
									TODO: Fix the bug here on the render of stars
								*/}
								<RatingStars rating={rating} />
								<p>{el}%</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RatingStarsContainer;

{
	/* <div className='flex items-center gap-[2px]'>
	{arr.map((el, idx) => {
		return (
			<FaStar
				key={idx}
				className={`${
					idx < el ? 'fill-orange-400' : ''
				} h-3 w-3`}
			/>
		);
	})}
</div> */
}
