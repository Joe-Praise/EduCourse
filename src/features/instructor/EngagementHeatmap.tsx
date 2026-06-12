import { useMemo, useState } from 'react';
import { cn } from '../../lib/cn';

interface HeatmapCell {
	day: number; // 0=Mon ... 6=Sun
	hour: number; // 0..23
	value: number;
}

interface EngagementHeatmapProps {
	data?: ReadonlyArray<HeatmapCell>;
	className?: string;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generatePlaceholder = (): ReadonlyArray<HeatmapCell> => {
	const cells: HeatmapCell[] = [];
	for (let day = 0; day < 7; day++) {
		for (let hour = 0; hour < 24; hour++) {
			const eveningWeight = hour >= 18 && hour <= 22 ? 1.4 : hour >= 9 && hour <= 17 ? 0.9 : 0.3;
			const weekendWeight = day >= 5 ? 0.7 : 1;
			cells.push({
				day,
				hour,
				value: Math.max(0, Math.round(Math.random() * 30 * eveningWeight * weekendWeight)),
			});
		}
	}
	return cells;
};

export const EngagementHeatmap = ({ data, className }: EngagementHeatmapProps) => {
	const cells = useMemo(() => (data && data.length > 0 ? data : generatePlaceholder()), [data]);
	const max = useMemo(() => Math.max(...cells.map((c) => c.value), 1), [cells]);
	const [hover, setHover] = useState<HeatmapCell | null>(null);

	return (
		<div className={cn('rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8', className)}>
			<header className='mb-6'>
				<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
					Engagement
				</span>
				<h3
					className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
					style={{ fontVariationSettings: '"opsz" 32' }}
				>
					Lesson watches · weekly
				</h3>
			</header>

			<div className='flex gap-3'>
				{/* Day labels column */}
				<div className='flex flex-col justify-around py-1 shrink-0'>
					{DAY_LABELS.map((d) => (
						<span key={d} className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary'>
							{d}
						</span>
					))}
				</div>

				{/* Grid */}
				<div className='flex-1 relative'>
					<div
						className='grid gap-[3px]'
						style={{
							gridTemplateColumns: 'repeat(24, minmax(0, 1fr))',
							gridTemplateRows: 'repeat(7, 1fr)',
						}}
					>
						{cells.map((c, i) => {
							const intensity = c.value / max;
							const opacity = intensity === 0 ? 0.08 : 0.15 + intensity * 0.85;
							return (
								<button
									key={i}
									type='button'
									onMouseEnter={() => setHover(c)}
									onMouseLeave={() => setHover(null)}
									aria-label={`${DAY_LABELS[c.day]} ${c.hour}:00 — ${c.value} watches`}
									className='aspect-square rounded-[2px] cursor-default transition-transform hover:scale-110'
									style={{
										backgroundColor: c.value === 0 ? 'rgba(245,239,227,0.04)' : '#C8472E',
										opacity,
									}}
								/>
							);
						})}
					</div>

					{/* Hour labels */}
					<div
						className='mt-2 grid'
						style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
					>
						{[0, 6, 12, 18].map((h) => (
							<span
								key={h}
								className='font-mono text-2xs text-ink-tertiary tabular-nums'
								style={{ gridColumn: `${h + 1} / span 6` }}
							>
								{h.toString().padStart(2, '0')}
							</span>
						))}
					</div>

					{/* Tooltip */}
					{hover && (
						<div className='pointer-events-none absolute right-0 top-0 -translate-y-full mb-1 glass rounded-card px-3 py-2 shadow-warm-2'>
							<p className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
								{DAY_LABELS[hover.day]} {hover.hour.toString().padStart(2, '0')}:00
							</p>
							<p className='font-display font-semibold text-sm text-ink-primary tabular-nums'>
								{hover.value} watches
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Legend */}
			<div className='mt-6 flex items-center gap-2 font-mono text-2xs text-ink-tertiary'>
				<span>Less</span>
				{[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
					<span
						key={o}
						className='inline-block h-3 w-3 rounded-[2px]'
						style={{ backgroundColor: '#C8472E', opacity: o }}
					/>
				))}
				<span>More</span>
			</div>
		</div>
	);
};
