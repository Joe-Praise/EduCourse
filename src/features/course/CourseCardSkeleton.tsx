import { Surface, Skeleton } from '../../ui';
import { cn } from '../../lib/cn';

interface CourseCardSkeletonProps {
	className?: string;
}

export const CourseCardSkeleton = ({ className }: CourseCardSkeletonProps) => (
	<Surface level='raised' className={cn('overflow-hidden flex flex-col', className)}>
		<Skeleton variant='block' className='aspect-[4/3] rounded-none rounded-t-card' height='auto' />
		<div className='-mt-12 relative flex flex-1 flex-col px-5 pb-5'>
			<Skeleton variant='text' lines={2} className='mt-1' />
			<div className='mt-4 flex items-center gap-2.5'>
				<Skeleton variant='circle' width='24px' height='24px' />
				<Skeleton variant='text' lines={1} className='flex-1 max-w-[60%]' />
			</div>
			<div className='mt-4 flex items-center gap-3'>
				<Skeleton variant='text' lines={1} className='w-16' />
				<Skeleton variant='text' lines={1} className='w-20' />
				<Skeleton variant='text' lines={1} className='w-16' />
			</div>
			<div className='mt-auto pt-5 border-t border-line-subtle flex items-end justify-between'>
				<Skeleton variant='text' lines={1} className='w-20' />
				<Skeleton variant='text' lines={1} className='w-24' />
			</div>
		</div>
	</Surface>
);
