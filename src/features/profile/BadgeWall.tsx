import { Award, Flame, BookCheck, Star, Users, Target, Calendar, Crown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Badge {
	id: string;
	name: string;
	description: string;
	icon: typeof Award;
	earned: boolean;
}

interface BadgeWallProps {
	badges?: ReadonlyArray<Badge>;
	className?: string;
}

const PLACEHOLDER: ReadonlyArray<Badge> = [
	{ id: 'first-course', name: 'First steps', description: 'Enrolled in your first course', icon: BookCheck, earned: true },
	{ id: 'streak-7', name: 'Week one', description: '7-day learning streak', icon: Flame, earned: true },
	{ id: 'first-review', name: 'First word', description: 'Left your first review', icon: Star, earned: true },
	{ id: 'first-complete', name: 'Finisher', description: 'Completed your first course', icon: Award, earned: true },
	{ id: 'streak-30', name: 'Month deep', description: '30-day streak', icon: Calendar, earned: false },
	{ id: 'social', name: 'Connector', description: 'Followed 10 instructors', icon: Users, earned: false },
	{ id: 'mastery', name: 'Mastery', description: 'Completed 5 courses', icon: Target, earned: false },
	{ id: 'top', name: 'Top of class', description: 'Top 1% of learners', icon: Crown, earned: false },
];

export const BadgeWall = ({ badges, className }: BadgeWallProps) => {
	const items = badges && badges.length > 0 ? badges : PLACEHOLDER;
	const earnedCount = items.filter((b) => b.earned).length;

	return (
		<div className={cn(className)}>
			<header className='mb-6 flex items-end justify-between'>
				<div>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
						Achievements
					</span>
					<h3
						className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						{earnedCount} / {items.length} earned
					</h3>
				</div>
			</header>

			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				{items.map((badge) => {
					const Icon = badge.icon;
					return (
						<div
							key={badge.id}
							className={cn(
								'group relative aspect-square rounded-card border p-4 flex flex-col items-center justify-center text-center gap-2',
								badge.earned
									? 'border-clay-500/40 bg-clay-500/5 hover:bg-clay-500/10 transition-colors'
									: 'border-line-subtle bg-bg-raised opacity-50',
							)}
							title={badge.description}
						>
							<span
								className={cn(
									'inline-grid place-items-center h-12 w-12 rounded-full',
									badge.earned ? 'bg-clay-500/15 text-clay-400' : 'bg-bg-overlay text-ink-tertiary',
								)}
							>
								<Icon size={20} strokeWidth={1.75} />
							</span>
							<span className='font-display font-medium text-xs text-ink-primary leading-tight'>
								{badge.name}
							</span>
							<span className='font-body text-2xs text-ink-tertiary leading-tight line-clamp-2 hidden sm:block'>
								{badge.description}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
