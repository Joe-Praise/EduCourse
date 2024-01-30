import RatingStarsContainer from '../shared/RatingStarsContainer';
import CommentCard from './CommentCard';
const Review = () => {
	const arr = Array.from(Array(4), () => 0);
	return (
		<section>
			<h1>Students Feedback</h1>
			<RatingStarsContainer
				rating={'4'}
				// totalRating={'146,951'}
				percentage={[100, 50, 10, 5, 22]}
			/>
			<CommentCard />
			<CommentCard />
			<CommentCard />
			<ul className='flex gap-2 justify-center mt-5'>
				{arr.map((_, i) => {
					return (
						<li
							key={i}
							className='w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white'
						>
							{i + 1}
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default Review;
// interface Iprop {
// 	value: number;
// 	star: number;
// }

// const percentage: Iprop[] = [
// 	{ value: 100, star: 1 },
// 	{ value: 5, star: 2 },
// 	{ value: 10, star: 3 },
// 	{ value: 30, star: 4 },
// 	{ value: 20, star: 5 },
// ];
