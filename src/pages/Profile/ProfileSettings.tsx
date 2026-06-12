import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Award, Flame, BookCheck, Star, Users, Target, Calendar, Crown, Settings2, Shield } from 'lucide-react';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import { getLearningStreakAction, getUserBadgesAction } from '../../redux/actions/userAction';
import ProfileAvatarUpload from '../../components/Profile/ProfileAvatarUpload';
import ProfileInfoForm from '../../components/Profile/ProfileInfoForm';
import ChangePasswordForm from '../../components/Profile/ChangePasswordForm';
import NotificationPreferencesForm from '../../components/Profile/NotificationPreferencesForm';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { StreakHeatmap, BadgeWall } from '../../features/profile';
import { Avatar, Tabs, type TabItem } from '../../ui';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { useState } from 'react';

const BADGE_ICON_MAP: Record<string, typeof Award> = {
	'first-course': BookCheck,
	'streak-7': Flame,
	'first-review': Star,
	'first-complete': Award,
	'streak-30': Calendar,
	'connector': Users,
	'mastery': Target,
	'top': Crown,
};

type TabKey = 'overview' | 'info' | 'security' | 'notifications';
const TAB_ITEMS: ReadonlyArray<TabItem<TabKey>> = [
	{ value: 'overview', label: 'Overview' },
	{ value: 'info', label: 'Personal info' },
	{ value: 'security', label: 'Security' },
	{ value: 'notifications', label: 'Notifications' },
];

const ProfileSettings: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user.userObj);
	const streak = useSelector((state: RootState) => state.user.streak);
	const badges = useSelector((state: RootState) => state.user.badges);
	const [active, setActive] = useState<TabKey>('overview');

	useEffect(() => {
		if (user?._id) {
			dispatch(getLearningStreakAction());
			dispatch(getUserBadgesAction());
		}
	}, [dispatch, user?._id]);

	const badgesWithIcons = useMemo(
		() =>
			badges.map((b: { id: string; name: string; description: string; earned: boolean }) => ({
				...b,
				icon: BADGE_ICON_MAP[b.id] ?? Award,
			})),
		[badges],
	);

	const displayName = user?.name ?? 'Friend';
	const tagline = user?.role?.includes('instructor')
		? 'Practitioner. Teacher. Quietly building.'
		: 'Learning the work that pays.';

	return (
		<PageLayout width='default' className='pt-16 sm:pt-24 pb-32'>
			{/* Hero */}
			<header className='mb-12'>
				<div className='flex flex-wrap items-end gap-8'>
					<Avatar size='xl' src={imgSrc(user?.photo, '/img/', TRANSFORMS.avatarLg)} fallback={displayName} className='shrink-0' />
					<div className='flex-1 min-w-[260px]'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							Profile
						</span>
						<Reveal
							mode='word-split'
							as='h1'
							className='mt-3 font-display font-semibold text-5xl sm:text-6xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
						>
							{displayName}.
						</Reveal>
						<p className='mt-4 font-body text-lg text-ink-secondary italic'>{tagline}</p>
					</div>
					<div className='flex flex-col gap-2 items-stretch'>
						<Link
							to={user?.role?.includes('instructor') ? '/instructor/dashboard' : '/my-courses/learning'}
							className='inline-flex items-center justify-center gap-2 h-11 px-5 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body font-medium text-sm transition-colors'
						>
							{user?.role?.includes('instructor') ? 'Open dashboard' : 'My learning'}
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
					</div>
				</div>
			</header>

			<Tabs
				aria-label='Profile sections'
				items={TAB_ITEMS}
				value={active}
				onChange={setActive}
				className='mb-10'
			/>

			{active === 'overview' && (
				<div className='grid gap-6 lg:grid-cols-[1fr_1.4fr]'>
					<div className='space-y-6'>
						<StreakHeatmap days={streak?.days} />
						<BadgeWall badges={badgesWithIcons.length > 0 ? badgesWithIcons : undefined} />
					</div>
					<div className='space-y-6'>
						<div className='rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8'>
							<header className='mb-6'>
								<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
									Continue learning
								</span>
								<h3
									className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
									style={{ fontVariationSettings: '"opsz" 32' }}
								>
									Pick up where you left off
								</h3>
							</header>
							<p className='font-body text-sm text-ink-tertiary'>
								Open <Link to='/my-courses/learning' className='text-clay-400 hover:text-clay-500'>My Learning</Link> to see
								your in-progress courses with progress bars.
							</p>
						</div>
						<Link
							to='/certificates'
							className='block rounded-card border border-line-subtle bg-bg-raised hover:border-line-base hover:bg-bg-overlay/30 p-6 sm:p-8 transition-[border-color,background-color] duration-base ease-out-quart'
						>
							<header className='mb-4 flex items-center gap-2'>
								<Award size={14} strokeWidth={2} className='text-clay-400' />
								<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
									Certificates
								</span>
							</header>
							<p className='font-body text-sm text-ink-secondary'>
								Every course you&apos;ve completed lives in{' '}
								<span className='text-clay-400'>your certificates room</span>.
								Print, save, share.
							</p>
						</Link>
						<div className='rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8'>
							<header className='mb-4 flex items-center gap-2'>
								<Settings2 size={14} strokeWidth={2} className='text-clay-400' />
								<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
									Quick edit
								</span>
							</header>
							<p className='font-body text-sm text-ink-secondary'>
								Update your name, email, and avatar from the{' '}
								<button
									type='button'
									onClick={() => setActive('info')}
									className='text-clay-400 hover:text-clay-500 underline-offset-2 hover:underline'
								>
									Personal info
								</button>{' '}
								tab.
							</p>
						</div>
					</div>
				</div>
			)}

			{active === 'info' && (
				<div className='rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8 space-y-6 max-w-2xl'>
					<ProfileAvatarUpload />
					<hr className='border-line-subtle' />
					<ProfileInfoForm />
				</div>
			)}

			{active === 'security' && (
				<div className='rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8 max-w-xl'>
					<header className='mb-6 flex items-center gap-2'>
						<Shield size={14} strokeWidth={2} className='text-clay-400' />
						<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
							Security
						</span>
					</header>
					<ChangePasswordForm />
				</div>
			)}

			{active === 'notifications' && (
				<div className='rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8 max-w-2xl'>
					<NotificationPreferencesForm />
				</div>
			)}
		</PageLayout>
	);
};

export default ProfileSettings;
