import { useMemo, useState } from 'react';
import { cn } from '../../lib/cn';

interface StreakDay {
	date: string; // ISO date
	count: number;
}

interface StreakHeatmapProps {
	days?: ReadonlyArray<StreakDay>;
	weeks?: number; // default 13 (≈ 90 days)
	className?: string;
}

const generatePlaceholder = (weeks: number): ReadonlyArray<StreakDay> => {
	const today = new Date();
	const arr: StreakDay[] = [];
	const total = weeks * 7;
	for (let i = total - 1; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(today.getDate() - i);
		const r = Math.random();
		const count = r < 0.5 ? 0 : r < 0.75 ? 1 : r < 0.9 ? 2 : Math.floor(r * 5) + 2;
		arr.push({ date: d.toISOString().slice(0, 10), count });
	}
	return arr;
};

export const StreakHeatmap = ({ days, weeks = 13, className }: StreakHeatmapProps) => {
	const data = useMemo(() => (days && days.length > 0 ? days : generatePlaceholder(weeks)), [days, weeks]);
	const max = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data]);
	const [hover, setHover] = useState<StreakDay | null>(null);

	// Group into weeks
	const grid = useMemo(() => {
		const cols: StreakDay[][] = [];
		for (let i = 0; i < data.length; i += 7) {
			cols.push(data.slice(i, i + 7));
		}
		return cols;
	}, [data]);

	const totalLessons = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);

	return (
		<div className={cn('rounded-card border border-line-subtle bg-bg-raised p-5 sm:p-6', className)}>
			<header className='mb-4 flex items-end justify-between'>
				<div>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
						Streak
					</span>
					<p
						className='mt-1.5 font-display font-semibold text-xl text-ink-primary'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						{totalLessons} lessons · last {weeks * 7} days
					</p>
				</div>
				{hover && (
					<span className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
						{hover.date} · {hover.count} lessons
					</span>
				)}
			</header>

			<div className='flex gap-[3px] overflow-x-auto pb-1' onMouseLeave={() => setHover(null)}>
				{grid.map((week, wi) => (
					<div key={wi} className='flex flex-col gap-[3px]'>
						{week.map((day, di) => {
							const intensity = day.count / max;
							const opacity = day.count === 0 ? 0.06 : 0.2 + intensity * 0.8;
							return (
								<button
									key={di}
									type='button'
									onMouseEnter={() => setHover(day)}
									aria-label={`${day.date}: ${day.count} lessons`}
									className='h-3 w-3 rounded-[2px] cursor-default transition-transform hover:scale-110'
									style={{
										backgroundColor: day.count === 0 ? 'rgba(245,239,227,0.06)' : '#C8472E',
										opacity,
									}}
								/>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};
