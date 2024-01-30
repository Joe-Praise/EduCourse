import RatingStars from './RatingStars';
import img from '../../assets/image/card3.jpg';
import { useState } from 'react';
import RenderIf from '../shared/RenderIf';

const CommentCard = () => {
	const [truncate, setTruncate] = useState(true);

	const truncateValue = (value: string, leng: boolean) => {
		if (leng) {
			return value.slice(0, 250) + '...';
		} else {
			return value;
		}
	};

	return (
		<section className='flex gap-2 border-b py-2 my-1'>
			<div className='basis-[10%]'>
				<figure className='w-20 h-20 '>
					{/* interpolate this individuals name an the term profile picture with this alt */}
					<img src={img} alt={``} className='rounded-full ' />
				</figure>
			</div>
			<div className='flex-1'>
				<p>Joe Praise</p>
				<div className='flex gap-2 items-center'>
					<RatingStars rating='4' />
					<p>2 Weeks ago</p>
				</div>

				<div className='relative'>
					<p className='text-clip overflow-hidden '>
						{truncateValue(
							'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, quis. Eaque repellendus aliquid, excepturi perferendis enim tempore illo! Atque facilis fugit odit omnis obcaecati sequi iusto aspernatur cupiditate minus repudiandae nesciunt corporis saepe assumenda placeat ullam, sunt ut nisi. Autem ex fugiat error deserunt quia? Vel praesentium rerum corrupti qui doloremque nemo amet dolorem ab nam beatae! Aperiam corrupti aliquid laboriosam similique optio doloremque. Quas non dolore ullam nesciunt, adipisci delectus nulla hic odio officiis omnis, labore commodi. Architecto porro deserunt cumque natus, eligendi aliquid quis iste consequuntur tempore amet tempora officia soluta ad recusandae eveniet quod quas corporis nobis reprehenderit. Quia suscipit magnam cumque ab numquam maiores molestiae asperiores deserunt veritatis eveniet praesentium vitae exercitationem libero consequuntur a, facilis ea consequatur? Possimus nemo sapiente explicabo odit molestias iure eum, aperiam praesentium necessitatibus. Rerum voluptas autem optio quisquam consequatur, et voluptatibus commodi provident facere ex voluptatem ipsam suscipit voluptate aliquid qui? Saepe consectetur consequuntur ipsam, iusto, fugit incidunt facilis id odit, veniam voluptates libero. Autem, qui magnam? Id architecto ab qui dignissimos veritatis atque quae est et vel voluptatum sapiente dolore dolorum suscipit beatae hic, doloribus mollitia perspiciatis quia deserunt a tenetur! Eum, labore incidunt fugiat quia illo repellat. Quidem.',
							truncate
						)}
					</p>
					<RenderIf condition={truncate}>
						<button
							className='absolute rounded-sm p-1  -bottom-1 right-0 text-black'
							onClick={() => setTruncate((prevState) => !prevState)}
						>
							view more...
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
