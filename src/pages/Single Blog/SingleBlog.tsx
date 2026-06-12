import { FC, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LiaCommentsSolid } from 'react-icons/lia';
import { Clock3, ArrowUpRight, ChevronLeft } from 'lucide-react';
import { BlogCommentCard } from '../../components/Single Blog';
import { Comment, LoadingEffect, Pagination, RichTextDisplay } from '../../components/shared';
import { AppDispatch, RootState } from '../../redux/store';
import {
	createBlogCommentAction,
	getBlogCommentsAction,
	getSingleBlogAction,
} from '../../redux/actions/blogAction';
import { paginateType } from '../../redux/sharedTypes';
import { blogCommentType } from '../../redux/api/blogApi';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { ReadingProgress } from '../../patterns/ReadingProgress/ReadingProgress';
import { Avatar } from '../../ui';

const WORDS_PER_MINUTE = 220;

const estimateReadingMinutes = (html?: string): number => {
	if (!html) return 1;
	const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	const words = text ? text.split(' ').length : 0;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

const SingleBlog: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const blogs = useSelector((state: RootState) => state.blog);
	const singleBlog = blogs.singleBlog;
	const comments = blogs.comments;
	const blogError = blogs.blogError;

	const { slug } = useParams<{ slug: string }>();
	const limit = '6';

	const handleCourseComment = (commentText: string): void => {
		dispatch(createBlogCommentAction({ review: commentText }, singleBlog?._id));
	};

	useEffect(() => {
		dispatch(getSingleBlogAction(slug));
	}, [dispatch, slug]);

	useEffect(() => {
		if (singleBlog?._id) {
			dispatch(getBlogCommentsAction({ page: '1', limit }, singleBlog._id));
		}
	}, [singleBlog?._id, dispatch]);

	const handelQuerySearch = (details: paginateType) => {
		dispatch(getBlogCommentsAction(details, singleBlog?._id));
	};

	const readingMinutes = useMemo(
		() => estimateReadingMinutes(singleBlog?.description),
		[singleBlog?.description],
	);

	if (blogError) {
		return (
			<section className='min-h-[70svh] grid place-items-center px-6'>
				<div className='max-w-md text-center flex flex-col items-center gap-5'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						Off the page
					</span>
					<h2
						className='font-display font-semibold text-3xl sm:text-4xl text-ink-primary tracking-[-0.03em] leading-[1.05]'
						style={{ fontVariationSettings: '"opsz" 96' }}
					>
						We couldn&apos;t load this article.
					</h2>
					<p className='font-body text-sm text-ink-secondary leading-[1.6]'>
						The article may have moved or you might be offline. Try again, or head
						back to the archive.
					</p>
					<div className='flex flex-wrap items-center gap-3 mt-2'>
						<button
							type='button'
							onClick={() => dispatch(getSingleBlogAction(slug))}
							className='inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Try again
						</button>
						<Link
							to='/blogs'
							className='inline-flex items-center gap-2 h-11 px-5 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Back to archive
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
					</div>
				</div>
			</section>
		);
	}

	if (!singleBlog?._id) {
		return (
			<section className='py-32 grid place-items-center'>
				<LoadingEffect />
			</section>
		);
	}

	const authorName = singleBlog?.authorName ?? 'EduCourse Team';
	const authorPhoto = singleBlog?.authorPhoto;
	const tags = singleBlog?.tag ?? [];
	const eyebrow = tags[0]?.name;
	const commentsCount = singleBlog?.commentsQuantity ?? 0;

	return (
		<>
			<ReadingProgress targetId='blog-article' />

			{/* ── BACK NAV ── */}
			<div className='border-b border-line-subtle/60'>
				<PageLayout width='readable' className='py-5'>
					<Link
						to='/blogs'
						className='inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary hover:text-clay-400 transition-colors'
					>
						<ChevronLeft size={13} strokeWidth={2} />
						The archive
					</Link>
				</PageLayout>
			</div>

			{/* ── ESSAY HEADER (print-style, title-first) ── */}
			<PageLayout width='readable' className='pt-16 sm:pt-24 pb-12'>
				{/* Meta strip — single line, mono */}
				<div className='flex flex-wrap items-center gap-x-5 gap-y-2 mb-10'>
					{eyebrow && (
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							{eyebrow}
						</span>
					)}
					{singleBlog?.createdAt && (
						<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary'>
							{singleBlog.createdAt}
						</span>
					)}
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary inline-flex items-center gap-1.5'>
						<Clock3 size={11} strokeWidth={2} />
						{readingMinutes} min read
					</span>
				</div>

				{/* Title — left-aligned, huge Fraunces */}
				<h1
					className='font-display font-semibold text-ink-primary leading-[1.0] tracking-[-0.035em]'
					style={{
						fontSize: 'clamp(38px, 5.5vw, 72px)',
						fontVariationSettings: '"opsz" 144',
					}}
				>
					{singleBlog?.title}
				</h1>

				{/* Dek / lede */}
				{singleBlog?.summary && (
					<p
						className='mt-8 font-display italic text-ink-primary leading-[1.4]'
						style={{
							fontSize: 'clamp(20px, 2.2vw, 28px)',
							fontVariationSettings: '"opsz" 36',
						}}
					>
						{singleBlog.summary}
					</p>
				)}

				{/* Byline — generous spacing, full readable info */}
				<div className='mt-12 pt-8 border-t border-line-subtle flex items-center gap-4'>
					<Avatar
						size='lg'
						src={authorPhoto ? imgSrc(authorPhoto, '/img/', TRANSFORMS.avatarSm) : undefined}
						fallback={authorName}
					/>
					<div className='flex flex-col gap-0.5'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary'>
							Written by
						</span>
						<span className='font-body text-base font-medium text-ink-primary'>
							{authorName}
						</span>
					</div>
					<div className='ml-auto inline-flex items-center gap-2 font-body text-sm text-ink-secondary'>
						<LiaCommentsSolid size={16} />
						<span>{commentsCount}</span>
					</div>
				</div>
			</PageLayout>

			{/* ── LEAD IMAGE — wider than article column, but with margin ── */}
			<PageLayout width='default' className='pb-14 sm:pb-20'>
				<figure className='relative overflow-hidden rounded-card bg-bg-sunken'>
					<img
						src={imgSrc(singleBlog?.imageCover, '/blog/', TRANSFORMS.blogCoverHero)}
						alt={singleBlog?.title}
						className='w-full object-cover'
						style={{ aspectRatio: '21 / 9' }}
					/>
				</figure>
				{eyebrow && (
					<figcaption className='mt-4 max-w-screen-md mx-auto text-center font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary'>
						{singleBlog?.title}
					</figcaption>
				)}
			</PageLayout>

			{/* ── ARTICLE BODY — readable column, big legible type ── */}
			<PageLayout width='readable' id='blog-article' className='pb-20'>
				<article
					className='prose-drop prose prose-invert max-w-none
						prose-headings:font-display prose-headings:font-semibold prose-headings:text-ink-primary prose-headings:tracking-[-0.025em]
						prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-[38px] prose-h2:leading-[1.15]
						prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-[26px] prose-h3:leading-[1.2]
						prose-p:text-ink-primary prose-p:leading-[1.8] prose-p:text-[20px] prose-p:my-7
						prose-strong:text-ink-primary prose-strong:font-semibold
						prose-em:italic prose-em:text-ink-primary
						prose-li:text-ink-primary prose-li:leading-[1.7] prose-li:text-[20px] prose-li:my-2
						prose-ul:my-7 prose-ol:my-7
						prose-a:text-clay-400 prose-a:no-underline prose-a:border-b prose-a:border-clay-500/40 hover:prose-a:text-clay-500 hover:prose-a:border-clay-500
						prose-blockquote:my-14 prose-blockquote:border-0 prose-blockquote:pl-0 prose-blockquote:py-0 prose-blockquote:text-center
						prose-blockquote:font-display prose-blockquote:italic prose-blockquote:font-normal prose-blockquote:text-ink-primary
						prose-blockquote:text-[clamp(26px,3.2vw,40px)] prose-blockquote:leading-[1.32]
						prose-blockquote:before:content-["“"] prose-blockquote:before:block prose-blockquote:before:font-display prose-blockquote:before:text-clay-500 prose-blockquote:before:text-7xl prose-blockquote:before:leading-none prose-blockquote:before:mb-2
						prose-img:rounded-card prose-img:my-10 prose-img:w-full
						prose-figcaption:text-center prose-figcaption:font-mono prose-figcaption:text-2xs prose-figcaption:uppercase prose-figcaption:tracking-[0.18em] prose-figcaption:text-ink-secondary prose-figcaption:mt-3
						prose-code:text-clay-400 prose-code:bg-bg-raised prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.88em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
						prose-pre:bg-bg-raised prose-pre:border prose-pre:border-line-subtle prose-pre:rounded-card
						prose-hr:border-line-subtle prose-hr:my-14'
				>
					<RichTextDisplay html={singleBlog?.description} />
				</article>

				{/* ── End-of-article ornament ── */}
				<div
					aria-hidden
					className='mt-24 flex items-center justify-center gap-4 select-none'
				>
					<span className='h-px w-16 bg-line-base' />
					<span className='font-display italic text-3xl text-clay-500/80' style={{ fontVariationSettings: '"opsz" 144' }}>
						§
					</span>
					<span className='h-px w-16 bg-line-base' />
				</div>
			</PageLayout>

			{/* ── AUTHOR CARD — readable column ── */}
			<PageLayout width='readable' className='pb-14'>
				<section className='mt-14 rounded-card border border-line-base bg-bg-raised/50 p-7 sm:p-10 flex flex-col sm:flex-row items-start gap-6 sm:gap-8'>
					<Avatar
						size='xl'
						src={authorPhoto ? imgSrc(authorPhoto, '/img/', TRANSFORMS.avatarSm) : undefined}
						fallback={authorName}
					/>
					<div className='flex-1'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400 block mb-2'>
							About the author
						</span>
						<h3
							className='font-display font-semibold text-ink-primary leading-tight'
							style={{ fontSize: 'clamp(26px, 2.6vw, 36px)', fontVariationSettings: '"opsz" 96' }}
						>
							{authorName}
						</h3>
						<p className='mt-4 font-body text-[17px] text-ink-primary leading-[1.7] max-w-prose'>
							Practice over theory. Find more of {authorName.split(' ')[0]}'s writing
							in the archive — essays, deep-dives, and the occasional pattern study
							from the team building EduCourse.
						</p>
						<Link
							to='/blogs'
							className='mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-pill border border-line-base text-ink-primary hover:border-clay-500 hover:text-clay-400 transition-colors font-body text-sm font-medium'
						>
							Browse the archive
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
					</div>
				</section>
			</PageLayout>

			{/* ── TAGS — readable column, full pill row ── */}
			{tags.length > 0 && (
				<PageLayout width='readable' className='pb-14'>
					<div className='flex flex-wrap items-center gap-3'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary mr-2'>
							Filed under
						</span>
						{tags.map((t: { _id: string; name: string }) => (
							<span
								key={t._id}
								className='inline-flex items-center h-9 px-4 rounded-pill border border-line-base text-ink-primary font-body text-xs hover:border-clay-500 hover:text-clay-400 transition-colors cursor-default'
							>
								{t.name}
							</span>
						))}
					</div>
				</PageLayout>
			)}

			{/* ── COMMENTS — readable column, integrated band ── */}
			<section className='border-t border-line-subtle bg-bg-raised/30'>
				<PageLayout width='readable' className='py-20'>
					<div className='mb-10'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400 block mb-2'>
							The thread
						</span>
						<h2
							className='font-display font-semibold text-ink-primary leading-[0.98] tracking-[-0.03em]'
							style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontVariationSettings: '"opsz" 96' }}
						>
							{commentsCount === 0
								? 'Open the discussion.'
								: commentsCount === 1
								? '1 comment'
								: `${commentsCount} comments`}
						</h2>
					</div>

					<div className='rounded-card border border-line-base bg-bg-base p-6 sm:p-8 mb-10'>
						<Comment onCommentvalue={handleCourseComment} />
					</div>

					{comments?.data?.length > 0 && (
						<>
							<div className='flex flex-col gap-6'>
								{comments.data.map((item: blogCommentType) => (
									<BlogCommentCard key={item?._id} blogCommentDetails={item} />
								))}
							</div>
							<div className='mt-10'>
								<Pagination
									handlePagination={handelQuerySearch}
									metaData={comments.metaData}
									queryString={''}
								/>
							</div>
						</>
					)}
				</PageLayout>
			</section>
		</>
	);
};

export default SingleBlog;
