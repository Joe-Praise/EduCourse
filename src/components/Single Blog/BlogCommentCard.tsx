import { useState } from 'react';
import RenderIf from '../shared/RenderIf';
import { truncateValue } from '../../util/helperFunctions/helper';
import config from '../../../config';
import { blogCommentType } from '../../redux/api/blogApi';
import PublicProfileLink from '../shared/PublicProfileLink';

interface Iprop {
	blogCommentDetails: blogCommentType;
}

const BlogCommentCard = (props: Iprop) => {
	const {
		blogCommentDetails: { userId, review, createdAt },
	} = props;
	const [truncate, setTruncate] = useState(true);
	const truncateLimit = 250;

	return (
		<section className='flex gap-2 border-b py-2 my-2'>
			<div className='basis-[10%] flex justify-center items-center '>
				<PublicProfileLink userId={userId?._id}>
					<figure className='w-16 h-16 block'>
						<img
							src={`${config?.baseUrl}/img/${userId?.photo}`}
							alt={`${userId?.name}'s display image`}
							className='rounded-full '
						/>
					</figure>
				</PublicProfileLink>
			</div>
			<div className='flex-1'>
				<div className='flex justify-between items-center'>
					<PublicProfileLink userId={userId?._id}>
						<p>{userId?.name}</p>
					</PublicProfileLink>
					<p>{createdAt}</p>
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

export default BlogCommentCard;
