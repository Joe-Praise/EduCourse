import { Star } from 'lucide-react';
import { Text } from '../../ui';
import { cn } from '../../lib/cn';

interface RatingBucket {
	stars: number;
	count: number;
}

interface RatingDistributionBarProps {
	average: number;
	totalCount: number;
	buckets?: RatingBucket[];
	className?: string;
}

export const RatingDistributionBar = ({
	average,
	totalCount,
	buckets,
	className,
}: RatingDistributionBarProps) => {
	const safeBuckets = buckets ?? [
		{ stars: 5, count: 0 },
		{ stars: 4, count: 0 },
		{ stars: 3, count: 0 },
		{ stars: 2, count: 0 },
		{ stars: 1, count: 0 },
	];

	return (
		<div
			className={cn(
				'grid gap-6 sm:grid-cols-[140px_1fr] items-center p-4 rounded-card bg-bg-overlay border border-line-base',
				className,
			)}
		>
			<div className='flex flex-col items-center justify-center text-center'>
				<Text variant='display-lg' tone='primary' className='leading-none tabular-nums'>
					{average.toFixed(1)}
				</Text>
				<div className='flex items-center gap-0.5 mt-2'>
					{Array.from({ length: 5 }).map((_, i) => (
						<Star
							key={i}
							size={14}
							strokeWidth={1.5}
							className={
								i < Math.round(average) ? 'fill-brand-400 text-brand-400' : 'text-line-strong'
							}
						/>
					))}
				</div>
				<Text variant='body-xs' tone='tertiary' className='mt-1'>
					{totalCount.toLocaleString()} review{totalCount === 1 ? '' : 's'}
				</Text>
			</div>
			<div className='flex flex-col gap-1.5'>
				{safeBuckets.map((b) => {
					const pct = totalCount > 0 ? (b.count / totalCount) * 100 : 0;
					return (
						<div key={b.stars} className='flex items-center gap-3 text-xs'>
							<span className='w-10 inline-flex items-center gap-1 text-ink-tertiary tabular-nums'>
								{b.stars}
								<Star size={10} strokeWidth={2} className='text-ink-tertiary' />
							</span>
							<span
								className='flex-1 h-1.5 rounded-pill bg-line-subtle overflow-hidden'
								role='progressbar'
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={Math.round(pct)}
							>
								<span
									className='block h-full rounded-pill bg-gradient-to-r from-brand-500 to-brand-400 transition-[width] duration-slow ease-out-quart motion-reduce:transition-none'
									style={{ width: `${pct}%` }}
								/>
							</span>
							<span className='w-10 text-right text-ink-tertiary tabular-nums'>
								{b.count}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
