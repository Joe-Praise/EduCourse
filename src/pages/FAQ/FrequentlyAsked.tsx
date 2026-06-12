import { FC, useMemo, useState } from 'react';
import { Search, ChevronDown, User, CreditCard, BookOpen, Award, GraduationCap, Wrench } from 'lucide-react';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { Chip } from '../../ui';
import { cn } from '../../lib/cn';

interface FaqItem {
	question: string;
	answer: string;
	category: FaqCategory;
}

type FaqCategory = 'account' | 'billing' | 'courses' | 'certificates' | 'instructors' | 'technical';

const CATEGORIES: Array<{ key: FaqCategory; label: string; icon: typeof User; description: string }> = [
	{ key: 'account', label: 'Account', icon: User, description: 'Sign-up, profile, login.' },
	{ key: 'billing', label: 'Billing', icon: CreditCard, description: 'Payments, refunds, taxes.' },
	{ key: 'courses', label: 'Courses', icon: BookOpen, description: 'Enrolling, access, progress.' },
	{ key: 'certificates', label: 'Certificates', icon: Award, description: 'Completion, sharing.' },
	{ key: 'instructors', label: 'Instructors', icon: GraduationCap, description: 'Becoming a teacher.' },
	{ key: 'technical', label: 'Technical', icon: Wrench, description: 'Bugs, devices, playback.' },
];

const FAQS: ReadonlyArray<FaqItem> = [
	{ category: 'account', question: 'How do I sign up for an account?', answer: 'Click "Sign up" in the top-right. Enter your email and a password — that\'s it. No application form, no waiting list.' },
	{ category: 'courses', question: 'How do I enroll in a course?', answer: 'Open a course page and use the floating enrollment pill (bottom-right). Free courses enroll instantly; paid courses go through Stripe checkout.' },
	{ category: 'billing', question: 'What payment methods do you accept?', answer: 'Major credit cards (Visa, Mastercard, Amex, Discover) and PayPal. Stripe handles processing — we never see your card number.' },
	{ category: 'technical', question: 'Can I access my courses on multiple devices?', answer: 'Yes. Sign in on any device — desktop, tablet, phone — and your progress syncs across all of them.' },
	{ category: 'courses', question: 'Are there prerequisites for taking courses?', answer: 'Each course lists its own prerequisites in the curriculum section. Most are self-contained.' },
	{ category: 'courses', question: 'How long do I have access after enrolling?', answer: 'Lifetime access. Your enrolled courses remain available as long as the course exists on the platform.' },
	{ category: 'certificates', question: 'Do you offer certificates upon completion?', answer: 'Yes — for most courses. Complete all lessons and a downloadable certificate appears on your profile.' },
	{ category: 'technical', question: 'What if I run into technical issues?', answer: 'Email support@educourse.com or use the help button in the bottom-right of any page. We respond within 24h on weekdays.' },
	{ category: 'instructors', question: 'How do I become an instructor?', answer: 'Open your profile, switch on "Become an instructor", then open the Course Builder to create your first course. Approval is automatic for the first course.' },
	{ category: 'billing', question: 'Can I get a refund?', answer: 'Yes — 14-day no-questions refund on all paid courses. Email support@educourse.com with your order number.' },
];

const FrequentlyAsked: FC = () => {
	const [query, setQuery] = useState<string>('');
	const [category, setCategory] = useState<FaqCategory | 'all'>('all');
	const [openId, setOpenId] = useState<string | null>(null);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return FAQS.filter((f) => {
			if (category !== 'all' && f.category !== category) return false;
			if (q.length < 2) return true;
			return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
		});
	}, [query, category]);

	return (
		<PageLayout width='default' className='pt-16 sm:pt-24 pb-32'>
			{/* Hero */}
			<header className='mb-16'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					Help center
				</span>
				<Reveal
					mode='word-split'
					as='h1'
					className='mt-3 font-display font-semibold text-5xl sm:text-6xl lg:text-7xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
				>
					How can we help?
				</Reveal>

				<div className='mt-10 max-w-2xl relative'>
					<Search size={16} strokeWidth={2} className='absolute left-5 top-1/2 -translate-y-1/2 text-ink-tertiary' />
					<input
						type='text'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search anything…'
						className='w-full h-14 pl-14 pr-5 rounded-pill bg-bg-raised border border-line-base focus:border-line-strong text-ink-primary placeholder:text-ink-tertiary font-body text-base outline-none focus:shadow-focus-ring transition-[border-color,box-shadow] duration-base'
					/>
				</div>
			</header>

			{/* Category tiles */}
			<section className='mb-16'>
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
					{CATEGORIES.map((cat) => {
						const Icon = cat.icon;
						const isActive = category === cat.key;
						return (
							<button
								key={cat.key}
								type='button'
								onClick={() => setCategory(isActive ? 'all' : cat.key)}
								data-cursor='grow'
								className={cn(
									'group relative rounded-card p-5 text-left border transition-all duration-base',
									isActive
										? 'border-clay-500/50 bg-clay-500/5'
										: 'border-line-subtle bg-bg-raised hover:border-line-base hover:bg-bg-overlay/30',
								)}
							>
								<span
									className={cn(
										'inline-grid place-items-center h-10 w-10 rounded-full mb-3 transition-colors',
										isActive ? 'bg-clay-500/15 text-clay-400' : 'bg-bg-overlay text-ink-secondary',
									)}
								>
									<Icon size={16} strokeWidth={1.75} />
								</span>
								<p
									className='font-display font-semibold text-lg text-ink-primary leading-tight tracking-[-0.01em]'
									style={{ fontVariationSettings: '"opsz" 32' }}
								>
									{cat.label}
								</p>
								<p className='mt-1 font-body text-2xs text-ink-tertiary leading-tight'>
									{cat.description}
								</p>
							</button>
						);
					})}
				</div>
			</section>

			{/* Active filter chip */}
			{category !== 'all' && (
				<div className='mb-8 flex items-center gap-3'>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
						Showing
					</span>
					<Chip selected removable onRemove={() => setCategory('all')}>
						{CATEGORIES.find((c) => c.key === category)?.label}
					</Chip>
				</div>
			)}

			{/* FAQ list */}
			<section>
				{filtered.length === 0 ? (
					<div className='py-24 grid place-items-center text-center'>
						<div className='max-w-md'>
							<h3 className='font-display font-semibold text-2xl text-ink-primary'>No matches.</h3>
							<p className='mt-2 font-body text-sm text-ink-tertiary'>
								Try a different keyword or pick another category.
							</p>
						</div>
					</div>
				) : (
					<ul className='divide-y divide-line-subtle border-y border-line-subtle'>
						{filtered.map((faq, idx) => {
							const id = `${faq.category}-${idx}`;
							const isOpen = openId === id;
							return (
								<li key={id}>
									<button
										type='button'
										onClick={() => setOpenId(isOpen ? null : id)}
										className='group flex w-full items-center justify-between gap-6 py-5 text-left'
										aria-expanded={isOpen}
									>
										<h3
											className='font-display font-medium text-xl text-ink-primary group-hover:text-clay-400 transition-colors'
											style={{ fontVariationSettings: '"opsz" 32' }}
										>
											{faq.question}
										</h3>
										<ChevronDown
											size={18}
											strokeWidth={2}
											aria-hidden
											className={cn(
												'shrink-0 text-ink-tertiary transition-transform duration-base',
												isOpen && 'rotate-180 text-clay-400',
											)}
										/>
									</button>
									<div
										className={cn(
											'grid transition-[grid-template-rows] duration-slow ease-out-quart',
											isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
										)}
									>
										<div className='overflow-hidden'>
											<p className='pb-6 max-w-3xl font-body text-base text-ink-secondary leading-[1.7]'>
												{faq.answer}
											</p>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</section>
		</PageLayout>
	);
};

export default FrequentlyAsked;
