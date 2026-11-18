import { useState } from 'react';
import RenderIf from '../shared/RenderIf';
import { truncateValue } from '../../util/helperFunctions/helper';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
import { OmittedReviewDataType } from '../../redux/api/reviewApi';
import PublicProfileLink from '../shared/PublicProfileLink';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { Avatar } from '../../ui';
import { RatingStars } from '../../features/course';

const CommentCard = (props: OmittedReviewDataType) => {
	const { userId, review = '', rating, createdAt } = props;
	const [truncate, setTruncate] = useState(true);
	const truncateLimit = 250;
	const isLong = review.length > truncateLimit;

	return (
		<article className='flex items-start gap-4 pb-6 border-b border-line-subtle'>
			<PublicProfileLink userId={userId?._id}>
				<Avatar
					size='md'
					src={userId?.photo ? imgSrc(userId.photo, '/img/', TRANSFORMS.avatarSm) : undefined}
					fallback={userId?.name ?? '?'}
				/>
			</PublicProfileLink>

			<div className='flex-1 min-w-0'>
				<div className='flex items-center justify-between gap-3'>
					<PublicProfileLink userId={userId?._id}>
						<span className='font-body text-sm font-medium text-ink-primary hover:text-clay-400 transition-colors'>
							{userId?.name}
						</span>
					</PublicProfileLink>
					{createdAt && (
						<time
							dateTime={createdAt}
							className='font-body text-xs text-ink-tertiary tabular-nums whitespace-nowrap'
						>
							{handleDateFormat(createdAt)}
						</time>
					)}
				</div>

				<RatingStars rating={rating} size={12} className='mt-1' />

				<RenderIf condition={review.length > 0}>
					<p className='mt-2 font-body text-sm text-ink-primary/90 leading-[1.6] whitespace-pre-wrap break-words'>
						{truncateValue(review, truncate, truncateLimit)}
					</p>
				</RenderIf>

				<RenderIf condition={isLong}>
					<button
						type='button'
						onClick={() => setTruncate((prev) => !prev)}
						className='mt-2 font-body text-xs text-clay-400 hover:text-clay-500 transition-colors'
					>
						{truncate ? 'View more' : 'Show less'}
					</button>
				</RenderIf>
			</div>
		</article>
	);
};

export default CommentCard;
