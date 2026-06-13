import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, X, Mail, Award, MessageCircle, AlertCircle } from 'lucide-react';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import {
	getNotificationsAction,
	getUnreadCountAction,
	markNotificationReadAction,
	markAllReadAction,
	deleteNotificationAction,
} from '../../redux/actions/notificationAppAction';
import Pagination from '../../components/shared/Pagination';
import { ConfirmDialog } from '../../components/shared';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Chip } from '../../ui';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { cn } from '../../lib/cn';

type FilterKey = 'all' | 'unread' | 'mentions' | 'system';

const FILTER_LABELS: ReadonlyArray<{ key: FilterKey; label: string }> = [
	{ key: 'all', label: 'All' },
	{ key: 'unread', label: 'Unread' },
	{ key: 'mentions', label: 'Mentions' },
	{ key: 'system', label: 'System' },
];

interface Notification {
	_id: string;
	type: string;
	title: string;
	message: string;
	read: boolean;
	link?: string;
	createdAt: string;
}

const getIcon = (type: string) => {
	const t = type.toLowerCase();
	if (t.includes('comment') || t.includes('mention') || t.includes('review')) return MessageCircle;
	if (t.includes('award') || t.includes('badge') || t.includes('certificate')) return Award;
	if (t.includes('enroll') || t.includes('course')) return Mail;
	if (t.includes('alert') || t.includes('error') || t.includes('warning')) return AlertCircle;
	return Bell;
};

const getIconTone = (type: string): string => {
	const t = type.toLowerCase();
	if (t.includes('comment') || t.includes('mention')) return 'text-clay-400 bg-clay-500/15';
	if (t.includes('award') || t.includes('badge')) return 'text-sienna-400 bg-sienna-500/15';
	if (t.includes('alert') || t.includes('error')) return 'text-signal-danger bg-signal-danger/15';
	return 'text-ink-secondary bg-bg-overlay';
};

const groupByTime = (items: ReadonlyArray<Notification>): Array<{ label: string; items: Notification[] }> => {
	const now = Date.now();
	const dayMs = 24 * 60 * 60 * 1000;
	const today: Notification[] = [];
	const week: Notification[] = [];
	const earlier: Notification[] = [];
	for (const n of items) {
		const diff = now - new Date(n.createdAt).getTime();
		if (diff < dayMs) today.push(n);
		else if (diff < 7 * dayMs) week.push(n);
		else earlier.push(n);
	}
	const groups: Array<{ label: string; items: Notification[] }> = [];
	if (today.length) groups.push({ label: 'Today', items: today });
	if (week.length) groups.push({ label: 'This week', items: week });
	if (earlier.length) groups.push({ label: 'Earlier', items: earlier });
	return groups;
};

const NotificationsPage: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const initRef = useRef(true);
	const [filter, setFilter] = useState<FilterKey>('all');
	const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

	const { notifications, metaData, unreadCount } = useSelector(
		(state: RootState) => state.notificationApp,
	);

	useEffect(() => {
		if (initRef.current) {
			initRef.current = false;
			dispatch(getNotificationsAction('1'));
			dispatch(getUnreadCountAction());
		}
	}, [dispatch]);

	const handlePagination = ({ page }: { page: string }) => {
		dispatch(getNotificationsAction(page));
	};

	const filtered = useMemo(() => {
		const list = notifications as ReadonlyArray<Notification>;
		if (filter === 'unread') return list.filter((n) => !n.read);
		if (filter === 'mentions') return list.filter((n) => /comment|mention|review/i.test(n.type));
		if (filter === 'system') return list.filter((n) => /system|alert|update/i.test(n.type));
		return list;
	}, [notifications, filter]);

	const groups = useMemo(() => groupByTime(filtered), [filtered]);

	return (
		<PageLayout width='default' className='pt-16 sm:pt-24 pb-32'>
			<header className='mb-12 flex flex-wrap items-end justify-between gap-6'>
				<div>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
					</span>
					<Reveal
						mode='word-split'
						as='h1'
						className='mt-3 font-display font-semibold text-5xl sm:text-6xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
					>
						Activity.
					</Reveal>
				</div>
				{unreadCount > 0 && (
					<button
						type='button'
						onClick={() => dispatch(markAllReadAction())}
						className='font-body text-sm text-clay-400 hover:text-clay-500 transition-colors'
					>
						Mark all read
					</button>
				)}
			</header>

			<div className='mb-8 flex flex-wrap gap-2'>
				{FILTER_LABELS.map((f) => (
					<Chip key={f.key} selected={filter === f.key} onSelect={() => setFilter(f.key)}>
						{f.label}
					</Chip>
				))}
			</div>

			{filtered.length === 0 ? (
				<div className='py-24 grid place-items-center text-center'>
					<div className='max-w-md'>
						<span className='inline-grid place-items-center h-16 w-16 rounded-full bg-bg-overlay text-ink-tertiary mx-auto'>
							<Bell size={20} strokeWidth={1.5} />
						</span>
						<h3 className='mt-6 font-display font-semibold text-2xl text-ink-primary'>
							No notifications {filter !== 'all' ? `for ${filter}` : 'yet'}.
						</h3>
						<p className='mt-2 font-body text-sm text-ink-tertiary'>
							We'll let you know when something happens.
						</p>
					</div>
				</div>
			) : (
				<div className='space-y-12'>
					{groups.map((group) => (
						<section key={group.label}>
							<h2 className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary mb-4'>
								{group.label}
							</h2>
							<ul className='space-y-1'>
								{group.items.map((n) => {
									const Icon = getIcon(n.type);
									return (
										<li key={n._id}>
											<div
												className={cn(
													'group flex items-start gap-4 px-4 py-3 rounded-card transition-colors',
													n.read
														? 'hover:bg-bg-overlay/40'
														: 'bg-clay-500/5 border border-clay-500/15 hover:bg-clay-500/10',
												)}
											>
												<span
													className={cn(
														'inline-grid place-items-center h-9 w-9 rounded-full shrink-0',
														getIconTone(n.type),
													)}
												>
													<Icon size={14} strokeWidth={2} />
												</span>
												<div className='flex-1 min-w-0'>
													<button
														type='button'
														onClick={() => !n.read && dispatch(markNotificationReadAction(n._id))}
														className='block text-left w-full'
													>
														<p
															className={cn(
																'font-display font-medium text-sm leading-tight',
																n.read ? 'text-ink-secondary' : 'text-ink-primary',
															)}
														>
															{n.title}
														</p>
														{n.message && (
															<p className='mt-1 font-body text-sm text-ink-tertiary line-clamp-2'>
																{n.message}
															</p>
														)}
														<p className='mt-1.5 font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
															{new Date(n.createdAt).toLocaleString(undefined, {
																dateStyle: 'short',
																timeStyle: 'short',
															})}
														</p>
													</button>
												</div>
												<button
													type='button'
													onClick={() => setPendingDelete({ id: n._id, title: n.title })}
													aria-label='Dismiss notification'
													className='shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-ink-tertiary hover:text-signal-danger'
												>
													<X size={14} strokeWidth={2} />
												</button>
											</div>
										</li>
									);
								})}
							</ul>
						</section>
					))}
				</div>
			)}

			{metaData?.totalPages > 1 && (
				<div className='mt-12'>
					<Pagination metaData={metaData} handlePagination={handlePagination} queryString='' />
				</div>
			)}

			<ConfirmDialog
				open={pendingDelete !== null}
				title='Dismiss this notification?'
				message={
					pendingDelete
						? `"${pendingDelete.title}" will be removed from your inbox. You can't undo this.`
						: undefined
				}
				confirmLabel='Dismiss'
				cancelLabel='Keep'
				tone='danger'
				onConfirm={() => {
					if (pendingDelete) dispatch(deleteNotificationAction(pendingDelete.id));
					setPendingDelete(null);
				}}
				onCancel={() => setPendingDelete(null)}
			/>
		</PageLayout>
	);
};

export default NotificationsPage;
