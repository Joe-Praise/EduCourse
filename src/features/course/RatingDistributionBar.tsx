import { Star } from 'lucide-react';
import { Text } from '../../ui';
import { cn } from '../../lib/cn';
import { RatingStars } from './RatingStars';

export interface RatingBucket {
	stars: number;
	/** Share of all reviews with this star rating, 0–100. */
	percent: number;
}

interface RatingDistributionBarProps {
	average: number;
	totalCount: number;
	buckets?: RatingBucket[];
	className?: string;
}

const EMPTY_BUCKETS: RatingBucket[] = [5, 4, 3, 2, 1].map((stars) => ({ stars, percent: 0 }));

export const RatingDistributionBar = ({
	average,
	totalCount,
	buckets,
	className,
}: RatingDistributionBarProps) => {
	const safeBuckets = buckets && buckets.length > 0 ? buckets : EMPTY_BUCKETS;

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
				<RatingStars rating={average} className='mt-2' />
				<Text variant='body-xs' tone='tertiary' className='mt-1'>
					{totalCount.toLocaleString()} review{totalCount === 1 ? '' : 's'}
				</Text>
			</div>
			<div className='flex flex-col gap-1.5'>
				{safeBuckets.map((b) => {
					const pct = Math.min(100, Math.max(0, b.percent));
					return (
						<div key={b.stars} className='flex items-center gap-3 text-xs'>
							<span className='w-10 inline-flex items-center gap-1 text-ink-tertiary tabular-nums'>
								{b.stars}
								<Star size={10} strokeWidth={2} aria-hidden className='text-ink-tertiary' />
							</span>
							<span
								className='flex-1 h-1.5 rounded-pill bg-line-subtle overflow-hidden'
								role='progressbar'
								aria-label={`${b.stars} star${b.stars === 1 ? '' : 's'}`}
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
								{Math.round(pct)}%
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
