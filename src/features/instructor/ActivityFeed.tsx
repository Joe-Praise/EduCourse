import { Users, Star, BookCheck, DollarSign } from 'lucide-react';
import { Avatar } from '../../ui';
import { cn } from '../../lib/cn';

type ActivityType = 'enrollment' | 'review' | 'completion' | 'payout';

export interface ActivityItem {
	id: string;
	type: ActivityType;
	personName?: string;
	personPhoto?: string;
	subject?: string;
	courseTitle?: string;
	rating?: number;
	amount?: number;
	timestamp: string; // ISO or relative
}

interface ActivityFeedProps {
	items?: ReadonlyArray<ActivityItem>;
	className?: string;
}

const PLACEHOLDER: ReadonlyArray<ActivityItem> = [
	{ id: 'a1', type: 'enrollment', personName: 'Anya Hartmann', courseTitle: 'Systems thinking for designers', timestamp: '2 min ago' },
	{ id: 'a2', type: 'review', personName: 'David Brun', courseTitle: 'Backend craft', rating: 5, timestamp: '12 min ago' },
	{ id: 'a3', type: 'completion', personName: 'Lina Cho', courseTitle: 'Type & letterform', timestamp: '34 min ago' },
	{ id: 'a4', type: 'payout', amount: 1247, timestamp: '2 hours ago' },
	{ id: 'a5', type: 'enrollment', personName: 'Marcus Vail', courseTitle: 'Motion fundamentals', timestamp: '4 hours ago' },
	{ id: 'a6', type: 'review', personName: 'Sasha Petrov', courseTitle: 'Editorial layout', rating: 4, timestamp: 'yesterday' },
];

const ICON_CLASS: Record<ActivityType, { Icon: typeof Users; bg: string; fg: string }> = {
	enrollment: { Icon: Users, bg: 'bg-clay-500/15', fg: 'text-clay-400' },
	review: { Icon: Star, bg: 'bg-sienna-500/15', fg: 'text-sienna-400' },
	completion: { Icon: BookCheck, bg: 'bg-signal-success/15', fg: 'text-signal-success' },
	payout: { Icon: DollarSign, bg: 'bg-ivory-500/15', fg: 'text-ivory-500' },
};

const sentenceFor = (item: ActivityItem): string => {
	switch (item.type) {
		case 'enrollment':
			return `${item.personName} enrolled in ${item.courseTitle}`;
		case 'review':
			return `${item.personName} left a ${item.rating}★ review on ${item.courseTitle}`;
		case 'completion':
			return `${item.personName} completed ${item.courseTitle}`;
		case 'payout':
			return `Payout of $${item.amount?.toLocaleString()} processed`;
	}
};

export const ActivityFeed = ({ items, className }: ActivityFeedProps) => {
	const feed = items && items.length > 0 ? items : PLACEHOLDER;

	return (
		<div className={cn('rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8', className)}>
			<header className='mb-6 flex items-end justify-between'>
				<div>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
						Activity
					</span>
					<h3
						className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						Recent events
					</h3>
				</div>
			</header>

			<ol className='space-y-4'>
				{feed.slice(0, 8).map((item) => {
					const { Icon, bg, fg } = ICON_CLASS[item.type];
					return (
						<li key={item.id} className='flex items-start gap-3'>
							<span className={cn('inline-grid place-items-center h-9 w-9 rounded-full shrink-0', bg, fg)}>
								<Icon size={14} strokeWidth={2} />
							</span>
							{item.personPhoto || item.personName ? (
								<Avatar size='xs' fallback={item.personName ?? ''} className='mt-0.5 shrink-0' />
							) : null}
							<div className='flex-1 min-w-0'>
								<p className='font-body text-sm text-ink-primary leading-tight'>
									{sentenceFor(item)}
								</p>
								<p className='mt-1 font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
									{item.timestamp}
								</p>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
};
