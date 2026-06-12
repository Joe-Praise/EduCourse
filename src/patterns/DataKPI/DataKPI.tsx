import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Surface, Text } from '../../ui';
import { cn } from '../../lib/cn';

interface DataKPIProps {
	label: string;
	value: string | number;
	deltaPercent?: number;
	sparkline?: ReadonlyArray<number>;
	className?: string;
}

const SPARK_W = 80;
const SPARK_H = 28;

const buildSparkPath = (points: ReadonlyArray<number>): string => {
	if (points.length === 0) return '';
	const min = Math.min(...points);
	const max = Math.max(...points);
	const range = max - min || 1;
	const step = SPARK_W / Math.max(points.length - 1, 1);
	return points
		.map((p, i) => {
			const x = i * step;
			const y = SPARK_H - ((p - min) / range) * SPARK_H;
			return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(' ');
};

export const DataKPI = ({ label, value, deltaPercent, sparkline, className }: DataKPIProps) => {
	const path = useMemo(() => (sparkline ? buildSparkPath(sparkline) : ''), [sparkline]);
	const deltaTone =
		typeof deltaPercent === 'number'
			? deltaPercent > 0
				? 'success'
				: deltaPercent < 0
					? 'danger'
					: 'tertiary'
			: 'tertiary';
	const DeltaIcon =
		typeof deltaPercent === 'number'
			? deltaPercent > 0
				? TrendingUp
				: deltaPercent < 0
					? TrendingDown
					: Minus
			: Minus;
	const deltaToneClass: Record<typeof deltaTone, string> = {
		success: 'text-signal-success',
		danger: 'text-signal-danger',
		tertiary: 'text-ink-tertiary',
	};

	return (
		<Surface level='raised' className={cn('p-5 flex flex-col gap-3', className)}>
			<Text variant='body-2xs' tone='tertiary' className='uppercase tracking-[0.12em]'>
				{label}
			</Text>
			<div className='flex items-end justify-between gap-3'>
				<Text variant='display-md' tone='primary' className='tabular-nums leading-none'>
					{value}
				</Text>
				{sparkline && sparkline.length > 1 && (
					<svg
						width={SPARK_W}
						height={SPARK_H}
						viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
						aria-hidden
						className='shrink-0'
					>
						<path d={path} stroke='#C8472E' strokeWidth='1.5' fill='none' />
					</svg>
				)}
			</div>
			{typeof deltaPercent === 'number' && (
				<div className={cn('inline-flex items-center gap-1.5 text-xs', deltaToneClass[deltaTone])}>
					<DeltaIcon size={12} strokeWidth={2.5} />
					<span className='tabular-nums'>
						{deltaPercent > 0 ? '+' : ''}
						{deltaPercent.toFixed(1)}%
					</span>
					<span className='text-ink-tertiary'>vs prev period</span>
				</div>
			)}
		</Surface>
	);
};
