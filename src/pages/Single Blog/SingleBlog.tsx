import { FC, useEffect } from 'react';
import { headerbadge } from '../../components/Single Course/HeaderContainer';
import { FaRegCalendar, FaUser } from 'react-icons/fa';
import { LiaCommentsSolid } from 'react-icons/lia';
import {
	Tags,
	BlogHeader,
	BlogCommentCard,
} from '../../components/Single Blog';
import { Comment, LoadingEffect, Pagination } from '../../components/shared';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
	createBlogCommentAction,
	getBlogCommentsAction,
	getSingleBlogAction,
} from '../../redux/actions/blogAction';
// import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
import config from '../../../config';
import useFormatText from '../../hooks/UseFormatText';
import { paginateType } from '../../redux/sharedTypes';
import { blogCommentType } from '../../redux/api/blogApi';

const SingleBlog: FC = () => {
	/**
	 * TODO:
	 * get single blog details
	 * write a fuction to generate the dataBadge
	 * get all tags. onClick...take back to blogs page with filtered data
	 * display comments for blog post
	 * dispatch action for comment generation on blog post
	 */

	const dispatch: AppDispatch = useDispatch();
	const singleBlog = useSelector((state: RootState) => state.blog.singleBlog);
	const blogs = useSelector((state: RootState) => state.blog);
	const comments = blogs.comments;
	const SingleBlog = blogs.singleBlog;

	const { slug } = useParams<{ slug: string }>();
	const slugString: string = slug || '';
	const { formatText } = useFormatText();
	const limit = '6';

	const dataDisplay: headerbadge[] = [
		{
			title: 'Joe Praise',
			total: '',
			icon: FaUser,
		},
		{
			title: singleBlog.createdAt,
			total: '',
			icon: FaRegCalendar,
		},
		{
			title: 'Comments',
			total: singleBlog.commentsQuantity + '' || '0',
			icon: LiaCommentsSolid,
		},
	];

	const handleCourseComment = (commentText: string): void => {
		const details = {
			review: commentText,
		};
		dispatch(createBlogCommentAction(details, SingleBlog?._id));
	};

	useEffect(() => {
		dispatch(getSingleBlogAction(slug));
	}, [dispatch, slug]);

	// gets the blog comments first page on load
	useEffect(() => {
		if (SingleBlog?._id) {
			// const timeout = setTimeout(() => {
			dispatch(getBlogCommentsAction({ page: '1', limit }, SingleBlog?._id));
			// }, 1000);
		}
	}, [SingleBlog?._id, dispatch]);

	const handelQuerySearch = (details: paginateType) => {
		dispatch(getBlogCommentsAction(details, SingleBlog?._id));
	};

	return (
		<section className='w-11/12 sm:w-9/12 md:w-[80%] xl:w-[55%] mx-auto py-3'>
			{singleBlog?._id ? (
				<>
					<BlogHeader dataDisplay={dataDisplay} headerTitle={slugString} />

					<div className='my-6'>
						<figure className='lg:h-[70vh] md:w-[100%] mx-auto'>
							<img
								src={`${config.baseUrl}/blog/${singleBlog?.imageCover}`}
								alt={`${singleBlog?.title}'s cover image`}
								className='w-full h-[100%] object-cover object-right-top rounded-lg'
							/>
						</figure>
					</div>

					<div>
						{formatText(singleBlog?.description).map((el, index) => (
							<p key={index} className='mt-3 text-base'>
								{el}
							</p>
						))}
					</div>

					<div className='mt-10'>
						<Tags tags={singleBlog?.tag} />
						<div className='mt-10'>
							<h1>Comments</h1>
							<p>
								{singleBlog?.commentsQuantity > 1
									? `${singleBlog?.commentsQuantity} comments`
									: `${singleBlog?.commentsQuantity} comment`}
							</p>
							{/* TODO:Handle comments & review upload */}

							<div className='my-5'>
								{comments?.data?.map((item: blogCommentType) => {
									return (
										<BlogCommentCard
											key={item?._id}
											blogCommentDetails={item}
										/>
									);
								})}

								<div className='my-5'>
									<Pagination
										handlePagination={handelQuerySearch}
										metaData={comments.metaData}
										queryString={''}
									/>
								</div>
							</div>
						</div>

						<div className='mt-10'>
							<Comment onCommentvalue={handleCourseComment} />
						</div>
					</div>
				</>
			) : (
				<LoadingEffect />
			)}
		</section>
	);
};

export default SingleBlog;
