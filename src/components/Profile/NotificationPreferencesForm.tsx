import { useEffect, useState } from 'react';
import { BellRing, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/cn';
import {
	getMyNotificationPreferencesApi,
	updateMyNotificationPreferencesApi,
	type NotificationPreferences,
	type PreferenceType,
	type ChannelPair,
} from '../../redux/api/notificationPreferencesApi';

type FetchState = 'idle' | 'loading' | 'ready' | 'error';

const TYPE_LABELS: Array<{ key: PreferenceType; label: string; description: string }> = [
	{
		key: 'enrollment',
		label: 'Enrollment',
		description: 'A student signs up for one of your courses, or you enroll in one.',
	},
	{
		key: 'review',
		label: 'Reviews',
		description: 'New review left on a course.',
	},
	{
		key: 'review_alert',
		label: 'Review alerts',
		description: 'Surge of negative reviews on your course — instructor only.',
	},
	{
		key: 'course_published',
		label: 'Course published',
		description: 'One of your draft courses is approved and published.',
	},
	{
		key: 'earning',
		label: 'Earnings',
		description: 'Payouts and revenue events — instructor only.',
	},
	{
		key: 'progress_nudge',
		label: 'Progress nudges',
		description: "Gentle reminders to come back to a course you've started.",
	},
	{
		key: 'system',
		label: 'System',
		description: 'Account updates, security notices, platform changes.',
	},
];

interface ToggleProps {
	checked: boolean;
	onChange: (next: boolean) => void;
	disabled?: boolean;
	label: string;
}

const Toggle = ({ checked, onChange, disabled, label }: ToggleProps) => (
	<button
		type='button'
		role='switch'
		aria-checked={checked}
		aria-label={label}
		disabled={disabled}
		onClick={() => onChange(!checked)}
		className={cn(
			'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-base ease-out-quart',
			'focus-visible:outline-none focus-visible:shadow-focus-ring',
			disabled && 'opacity-40 cursor-not-allowed',
			checked ? 'bg-clay-500' : 'bg-bg-overlay border border-line-base',
		)}
	>
		<span
			className={cn(
				'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-warm-1 transform transition-transform duration-base ease-out-quart',
				checked ? 'translate-x-[18px]' : 'translate-x-[3px]',
			)}
		/>
	</button>
);

const NotificationPreferencesForm = () => {
	const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
	const [status, setStatus] = useState<FetchState>('idle');
	const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
	const [error, setError] = useState<string>('');

	const load = async () => {
		setStatus('loading');
		const response = await getMyNotificationPreferencesApi();
		if ('error' in response && response.error) {
			setStatus('error');
			setError(response.error);
			return;
		}
		setPrefs((response as { data: NotificationPreferences }).data);
		setStatus('ready');
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const patch = async (next: NotificationPreferences, body: Parameters<typeof updateMyNotificationPreferencesApi>[0]) => {
		// Optimistic update — UI flips immediately.
		setPrefs(next);
		setSaveState('saving');
		const response = await updateMyNotificationPreferencesApi(body);
		if ('error' in response && response.error) {
			setSaveState('error');
			return;
		}
		setSaveState('saved');
		window.setTimeout(() => setSaveState('idle'), 1500);
	};

	if (status === 'loading' || status === 'idle') {
		return (
			<div className='py-12 grid place-items-center'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary animate-pulse'>
					Loading preferences…
				</span>
			</div>
		);
	}

	if (status === 'error' || !prefs) {
		return (
			<div className='py-12 flex flex-col items-center gap-4 text-center'>
				<AlertCircle size={20} strokeWidth={1.75} className='text-signal-danger' />
				<p className='font-body text-sm text-ink-tertiary'>
					{error || 'Could not load your notification preferences.'}
				</p>
				<button
					type='button'
					onClick={load}
					className='inline-flex items-center h-10 px-4 rounded-pill bg-clay-500 hover:bg-clay-600 text-white font-body text-sm transition-colors'
				>
					Try again
				</button>
			</div>
		);
	}

	const setMaster = (enabled: boolean) =>
		patch({ ...prefs, enabled }, { enabled });

	const setChannel = (type: PreferenceType, channel: keyof ChannelPair, value: boolean) => {
		const next = { ...prefs, [type]: { ...prefs[type], [channel]: value } };
		patch(next, { [type]: { [channel]: value } });
	};

	return (
		<div className='space-y-8'>
			<header>
				<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
					Notifications
				</span>
				<h3
					className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
					style={{ fontVariationSettings: '"opsz" 32' }}
				>
					What you want to hear about.
				</h3>
				<p className='mt-2 font-body text-sm text-ink-secondary leading-[1.6] max-w-md'>
					Each row controls one type of notification. In-app shows in the bell;
					email goes to {' '}
					<span className='text-ink-primary'>your inbox</span>.
				</p>
			</header>

			{/* Master switch */}
			<div className='flex items-center justify-between rounded-card border border-line-subtle bg-bg-overlay/30 p-4'>
				<div className='flex items-center gap-3'>
					<BellRing
						size={16}
						strokeWidth={1.75}
						className={prefs.enabled ? 'text-clay-400' : 'text-ink-tertiary'}
					/>
					<div>
						<p className='font-body text-sm text-ink-primary font-medium'>
							{prefs.enabled ? 'Notifications on' : 'All notifications muted'}
						</p>
						<p className='font-body text-xs text-ink-tertiary'>
							Master switch. Off silences everything below.
						</p>
					</div>
				</div>
				<Toggle
					checked={prefs.enabled}
					onChange={setMaster}
					label='Master notifications switch'
				/>
			</div>

			{/* Per-type grid */}
			<div className='rounded-card border border-line-subtle overflow-hidden'>
				<div className='grid grid-cols-[1fr_60px_60px] items-center px-4 py-3 border-b border-line-subtle bg-bg-overlay/30'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
						Type
					</span>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary text-center'>
						In-app
					</span>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary text-center'>
						Email
					</span>
				</div>
				<ul className='divide-y divide-line-subtle'>
					{TYPE_LABELS.map((row) => {
						const channel = prefs[row.key];
						return (
							<li
								key={row.key}
								className={cn(
									'grid grid-cols-[1fr_60px_60px] items-center px-4 py-4 transition-opacity',
									!prefs.enabled && 'opacity-50',
								)}
							>
								<div className='pr-4 min-w-0'>
									<p className='font-body text-sm text-ink-primary font-medium'>
										{row.label}
									</p>
									<p className='font-body text-xs text-ink-tertiary mt-0.5 leading-[1.5]'>
										{row.description}
									</p>
								</div>
								<div className='grid place-items-center'>
									<Toggle
										checked={channel.inApp && prefs.enabled}
										onChange={(v) => setChannel(row.key, 'inApp', v)}
										disabled={!prefs.enabled}
										label={`${row.label} in-app`}
									/>
								</div>
								<div className='grid place-items-center'>
									<Toggle
										checked={channel.email && prefs.enabled}
										onChange={(v) => setChannel(row.key, 'email', v)}
										disabled={!prefs.enabled}
										label={`${row.label} email`}
									/>
								</div>
							</li>
						);
					})}
				</ul>
			</div>

			{/* Save indicator */}
			<div className='h-5 flex items-center justify-end font-mono text-2xs uppercase tracking-[0.22em]'>
				{saveState === 'saving' && (
					<span className='text-ink-tertiary'>Saving…</span>
				)}
				{saveState === 'saved' && (
					<span className='inline-flex items-center gap-1.5 text-signal-success'>
						<Check size={11} strokeWidth={2.5} />
						Saved
					</span>
				)}
				{saveState === 'error' && (
					<span className='text-signal-danger'>Couldn&apos;t save — try again</span>
				)}
			</div>
		</div>
	);
};

export default NotificationPreferencesForm;
