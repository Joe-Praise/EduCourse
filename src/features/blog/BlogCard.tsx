import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../ui';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { cn } from '../../lib/cn';

export interface BlogCardData {
	_id: string;
	slug: string;
	title: string;
	summary?: string;
	imageCover: string;
	createdAt: string;
	authorName?: string;
	authorPhoto?: string;
	tag?: ReadonlyArray<{ _id: string; name: string }>;
}

interface BlogCardProps {
	blog: BlogCardData;
	variant?: 'default' | 'featured';
	className?: string;
}

const BlogCardComponent = ({ blog, variant = 'default', className }: BlogCardProps) => {
	const isFeatured = variant === 'featured';

	return (
		<article className={cn('group relative', className)}>
			<Link
				to={`/blogs/${blog.slug}`}
				data-cursor='grow'
				className={cn(
					'block h-full focus:outline-none focus-visible:shadow-focus-ring rounded-card',
					isFeatured && 'md:grid md:grid-cols-[1.4fr_1fr] md:gap-8 md:items-center',
				)}
			>
				<div
					className={cn(
						'relative overflow-hidden rounded-card',
						isFeatured ? 'aspect-[16/10] md:aspect-[3/2]' : 'aspect-[16/10]',
					)}
				>
					<img
						src={imgSrc(blog.imageCover, '/blog/', TRANSFORMS.blogCoverCard)}
						alt=''
						loading='lazy'
						decoding='async'
						className='absolute inset-0 h-full w-full object-cover will-change-transform transition-transform duration-slow ease-out-quart group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100'
					/>
					<div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent' />
				</div>

				<div className={cn('flex flex-col gap-3 pt-5', isFeatured && 'md:pt-0 md:gap-5')}>
					{blog.tag && blog.tag.length > 0 && (
						<span className='font-mono text-2xs uppercase tracking-[0.18em] text-clay-400'>
							{blog.tag[0].name}
						</span>
					)}

					<h3
						className={cn(
							'font-display font-semibold tracking-[-0.025em] text-ink-primary leading-[1.1] line-clamp-3',
							isFeatured ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl',
						)}
						style={{ fontVariationSettings: '"opsz" 96' }}
					>
						<span className='bg-[length:0%_1px] bg-bottom bg-no-repeat bg-gradient-to-r from-clay-500 to-clay-500 group-hover:bg-[length:100%_1px] transition-[background-size] duration-slow ease-out-quart'>
							{blog.title}
						</span>
					</h3>

					{blog.summary && (
						<p
							className={cn(
								'font-body text-ink-secondary leading-[1.6] line-clamp-3',
								isFeatured ? 'text-base md:text-lg' : 'text-sm',
							)}
						>
							{blog.summary}
						</p>
					)}

					<div className='mt-2 flex items-center gap-3'>
						<Avatar
							size='xs'
							src={blog.authorPhoto ? imgSrc(blog.authorPhoto, '/img/', TRANSFORMS.avatarSm) : undefined}
							fallback={blog.authorName ?? 'EduCourse'}
						/>
						<div className='flex items-center gap-2 leading-tight'>
							<span className='font-body text-2xs text-ink-secondary'>
								{blog.authorName ?? 'EduCourse Team'}
							</span>
							<span aria-hidden className='text-ink-muted'>·</span>
							<span className='font-body text-2xs text-ink-tertiary'>{blog.createdAt}</span>
						</div>
					</div>
				</div>
			</Link>
		</article>
	);
};

export const BlogCard = memo(BlogCardComponent);
