import { Flame } from 'lucide-react';
import { cn } from '../../lib/cn';

interface LearningStreakWidgetProps {
	days?: number;
	lessonsToday?: number;
	className?: string;
}

export const LearningStreakWidget = ({
	days = 1,
	lessonsToday = 0,
	className,
}: LearningStreakWidgetProps) => (
	<div
		className={cn(
			'inline-flex items-center gap-3 h-11 pl-3 pr-5 rounded-pill',
			'glass border border-line-base shadow-warm-1',
			className,
		)}
		aria-label={`Day ${days} streak — ${lessonsToday} lessons today`}
	>
		<span className='inline-grid place-items-center h-8 w-8 rounded-full bg-clay-500/15 text-clay-400'>
			<Flame size={14} strokeWidth={2} fill='currentColor' />
		</span>
		<span className='leading-tight'>
			<span className='block font-display font-semibold text-sm text-ink-primary tabular-nums'>
				Day {days}
			</span>
			<span className='block font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
				{lessonsToday} today
			</span>
		</span>
	</div>
);
