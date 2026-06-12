import { useState } from 'react';
import RenderIf from '../shared/RenderIf';
import { truncateValue } from '../../util/helperFunctions/helper';
import { blogCommentType } from '../../redux/api/blogApi';
import PublicProfileLink from '../shared/PublicProfileLink';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { Avatar } from '../../ui';

interface Iprop {
	blogCommentDetails: blogCommentType;
}

const BlogCommentCard = (props: Iprop) => {
	const {
		blogCommentDetails: { userId, review, createdAt },
	} = props;
	const [truncate, setTruncate] = useState(true);
	const truncateLimit = 250;
	const isLong = review.length > truncateLimit;

	return (
		<article className='flex gap-4 pb-6 border-b border-line-subtle'>
			<PublicProfileLink userId={userId?._id}>
				<Avatar
					size='md'
					src={userId?.photo ? imgSrc(userId.photo, '/img/', TRANSFORMS.avatarSm) : undefined}
					fallback={userId?.name ?? '?'}
				/>
			</PublicProfileLink>

			<div className='flex-1 min-w-0'>
				<div className='flex items-center justify-between gap-3 mb-2'>
					<PublicProfileLink userId={userId?._id}>
						<span className='font-body text-sm font-medium text-ink-primary hover:text-clay-400 transition-colors'>
							{userId?.name}
						</span>
					</PublicProfileLink>
					<span className='font-body text-xs text-ink-tertiary tabular-nums whitespace-nowrap'>
						{createdAt}
					</span>
				</div>

				<p className='font-body text-sm text-ink-primary/90 leading-[1.6] whitespace-pre-wrap break-words'>
					{truncateValue(review, truncate, truncateLimit)}
				</p>

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

export default BlogCommentCard;
