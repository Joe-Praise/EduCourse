import { FC } from 'react';
import DataBadge from '../../components/shared/DataBadge';
import { headerbadge } from '../../components/Single Course/HeaderContainer';
import { FaRegCalendar, FaUser } from 'react-icons/fa';
import { LiaCommentsSolid } from 'react-icons/lia';
import img from '../../assets/image/card1.jpg';
import Tags from '../../components/Single Blog/Tags';
import CommentCard from '../../components/Single Course/CommentCard';
import Comment from '../../components/shared/Comment';

const SingleBlog: FC = () => {
	/**
	 * TODO:
	 * get single blog details
	 * write a fuction to generate the dataBadge
	 * get all tags. onClick...take back to blogs page with filtered data
	 * display comments for blog post
	 * dispatch action for comment generation on blog post
	 */
	const dataDisplay: headerbadge[] = [
		{
			title: 'Joe Praise',
			total: '',
			icon: FaUser,
		},
		{
			title: new Date(Date.now()).toDateString(),
			total: '',
			icon: FaRegCalendar,
		},
		{
			title: 'Comments',
			total: '20',
			icon: LiaCommentsSolid,
		},
	];

	const handleCourseComment = (commentText: string): void => {
		console.log(commentText);
	};
	// const arr = Array.from(Array(4), () => 0);
	return (
		<section className='w-11/12 sm:w-9/12 md:w-[80%] xl:w-[55%] mx-auto py-3'>
			<div>
				<h1>React and Redux master class</h1>
				<div>
					<DataBadge dataDisplay={dataDisplay} />
				</div>
			</div>

			<div className='my-6'>
				<figure className='lg:h-[70vh] md:w-[100%] mx-auto'>
					<img
						src={img}
						alt=''
						className='w-full h-[100%] object-cover object-right-top rounded-lg'
					/>
				</figure>
			</div>

			<div>
				<p className='mt-2 mb-5'>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe
					nesciunt laboriosam illum dolore repellat sunt dolor incidunt harum
					doloribus repellendus tenetur aut quisquam commodi debitis vero quis
					repudiandae reprehenderit, provident cupiditate, minima odit
					obcaecati? Earum nemo dignissimos similique consequatur aliquam
					officia iste! Vero at a inventore vitae error nostrum assumenda iste
					laborum rerum expedita aperiam ducimus, quia enim harum facere cumque
					quasi repudiandae in distinctio odit doloremque quis perferendis
					praesentium! Asperiores magni incidunt, eligendi unde aspernatur
					molestiae culpa eius aliquam hic, voluptate aliquid dolore autem
					expedita laboriosam consequuntur dolor quos blanditiis excepturi? Et
					nulla aperiam exercitationem quasi distinctio? Temporibus eum quasi
					debitis, consequatur facilis iste illo blanditiis fuga enim quod,
					expedita placeat fugit provident, voluptate esse eaque at eligendi
					dignissimos iure mollitia vitae quam ipsam. Praesentium temporibus cum
					quibusdam adipisci earum illum, obcaecati dolores odit voluptatibus
					accusantium? Ratione quae error aliquid? Veniam in eveniet suscipit
					sequi! Quae ex totam fugiat dolores, temporibus consectetur expedita
					nesciunt blanditiis aliquid veniam maiores doloribus, cumque
					veritatis, velit voluptatum! Esse exercitationem, fugiat, maiores
					delectus distinctio molestiae error voluptas maxime quidem quibusdam
					consequatur ab iste iusto provident incidunt. Sit sequi maxime, atque
					temporibus, corporis sapiente, et doloribus distinctio in animi
					voluptatibus labore! Ex, asperiores nam! Quis.
				</p>
				<p>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum quaerat
					molestiae accusamus quis voluptas. Libero ipsum possimus eum! Iste
					quae fuga debitis reprehenderit maxime voluptatibus, magni blanditiis
					temporibus labore excepturi omnis, nulla tenetur doloremque a? Aut
					dolorem sint quae laudantium dolor eaque, repellendus incidunt eius
					recusandae aspernatur dolorum natus ea!
				</p>
			</div>

			<div className='mt-10'>
				<Tags />
				<div className='mt-10'>
					<h1>Comments</h1>
					<p>50 comments</p>
					<CommentCard />
					<CommentCard />
					<CommentCard />
				</div>

				<div className='mt-10'>
					<Comment onCommentvalue={handleCourseComment} />
				</div>
			</div>
		</section>
	);
};

export default SingleBlog;
