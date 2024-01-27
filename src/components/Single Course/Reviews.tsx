import RatingStars from '../shared/RatingStars';
const Review = () => {
	return (
		<section>
			<h1>Comments</h1>
			<RatingStars
				rating={'4'}
				totalRating={'146,951'}
				percentage={[100, 50, 10, 5]}
			/>
		</section>
	);
};

export default Review;
