import RatingStars from './RatingStars';
// import img from '../../assets/image/card3.jpg';
import { useState } from 'react';
import RenderIf from '../shared/RenderIf';
import { truncateValue } from '../../util/helperFunctions/helper';
import { OmittedReviewDataType } from '../../redux/api/reviewApi';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
import config from '../../../config';

const CommentCard = (props: OmittedReviewDataType) => {
	const { userId, review, rating, createdAt } = props;
	const [truncate, setTruncate] = useState(true);
	const truncateLimit = 250;

	return (
		<section className='flex gap-2 border-b py-2 my-1'>
			<div className='basis-[10%] flex justify-center items-center '>
				<figure className='w-16 h-16 block'>
					<img
						src={`${config?.baseUrl}/img/${userId?.photo}`}
						alt={`${userId?.name}'s display image`}
						className='rounded-full '
					/>
				</figure>
			</div>
			<div className='flex-1'>
				<p>{userId?.name}</p>
				<div className='flex gap-2 items-center'>
					<RatingStars rating={rating + ''} />
					<p>{handleDateFormat(createdAt)}</p>
				</div>

				<div className='relative'>
					<p className='text-clip overflow-hidden '>
						{truncateValue(review, truncate, truncateLimit)}
					</p>
					<RenderIf condition={truncate}>
						<button
							className='absolute rounded-sm p-1  -bottom-1 right-0 text-black'
							onClick={() => setTruncate((prevState) => !prevState)}
						>
							{review.length > truncateLimit ? 'view more...' : ''}
						</button>
					</RenderIf>
					<RenderIf condition={!truncate}>
						<div className='text-right'>
							<button
								className='rounded-sm p-1 text-right ms-auto text-black'
								onClick={() => setTruncate((prevState) => !prevState)}
							>
								hide
							</button>
						</div>
					</RenderIf>
				</div>
			</div>
		</section>
	);
};

export default CommentCard;
