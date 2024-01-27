import { FaStar } from 'react-icons/fa6';

interface Iprop {
	rating: string;
	totalRating: string;
	percentage: number[];
}

// type Iprop2 = number;

const RatingStars = (props: Iprop) => {
	const { rating, totalRating, percentage } = props;

	const arr2 = Array.from(Array(5), () => 0);
	return (
		<>
			<div className='flex gap-2 items-center'>
				<h1>{parseInt(rating).toFixed(1)}</h1>
				<div>
					<div className='flex gap-[2px]'>
						{arr2.map((_, idx) => (
							<FaStar
								key={idx}
								className={`${idx < parseInt(rating) ? 'fill-orange-400' : ''}`}
							/>
						))}
					</div>
					<p className='text-xs'>based on {totalRating} rating</p>
				</div>
			</div>
			<>
				{percentage.map((el, idx) => {
					const dynamicWidth = el ? `${el}%` : '0%';
					return (
						<div
							className='flex items-center justify-between gap-3 flex-wrap'
							key={idx}
						>
							<div className='flex gap-1 basis-[3%]'>
								<div className='flex items-center gap-[2px]'>
									{arr2.map((_, idx) => (
										<FaStar
											key={idx}
											className={`${
												idx < parseInt(rating) ? 'fill-orange-400' : ''
											} h-3 w-3`}
										/>
									))}
								</div>
								<p>{el}%</p>
							</div>
							<div
								// className={`basis-3/4 h-3 bg-slate-400 relative ${`after:absolute after:w-[${dynamicWidth}] after:h-3 after:bg-red-700`} `}

								className={`basis-10/12 h-3 bg-slate-400 relative after:h-3`}
							>
								<span
									className={`w-[${dynamicWidth}] absolute h-3 bg-red-700`}
								></span>
							</div>
						</div>
					);
				})}
			</>
		</>
	);
};

export default RatingStars;
