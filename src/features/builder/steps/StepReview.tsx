import { Check, AlertCircle } from 'lucide-react';
import { type CourseDraft, BUILDER_STEPS, type StepKey } from '../types';
import { cn } from '../../../lib/cn';

interface StepReviewProps {
	draft: CourseDraft;
	onJumpToStep: (step: StepKey) => void;
}

interface CheckItem {
	step: StepKey;
	label: string;
	ok: boolean;
}

export const StepReview = ({ draft, onJumpToStep }: StepReviewProps) => {
	const checks: ReadonlyArray<CheckItem> = [
		{ step: 'basics', label: 'Title set', ok: draft.title.trim().length >= 4 },
		{ step: 'basics', label: 'Slug set', ok: draft.slug.trim().length >= 4 },
		{ step: 'outcomes', label: 'At least one outcome', ok: draft.outcomes.some((o) => o.trim().length > 0) },
		{ step: 'curriculum', label: 'At least one module', ok: draft.modules.length > 0 },
		{ step: 'curriculum', label: 'At least one lesson', ok: draft.modules.some((m) => m.lessons.length > 0) },
		{ step: 'pricing', label: 'Pricing decided', ok: draft.pricingType === 'free' || draft.price > 0 },
		{ step: 'cover', label: 'Cover image set', ok: !!draft.coverImage },
		{ step: 'cover', label: 'Short description', ok: draft.shortDescription.trim().length > 12 },
	];

	const totalLessons = draft.modules.reduce((s, m) => s + m.lessons.length, 0);

	return (
		<div className='space-y-12'>
			{/* Summary card */}
			<section className='rounded-card border border-line-subtle bg-bg-raised overflow-hidden'>
				<div className='aspect-[3/1] relative bg-bg-overlay overflow-hidden'>
					{draft.coverImage ? (
						<img src={draft.coverImage} alt='' className='absolute inset-0 h-full w-full object-cover' />
					) : (
						<div className='absolute inset-0 grid place-items-center font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
							No cover image yet
						</div>
					)}
					<div className='absolute inset-0 bg-gradient-to-t from-bg-raised to-transparent' />
					<div className='absolute inset-x-0 bottom-0 p-6'>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
							{draft.level}
						</span>
						<h2
							className='mt-2 font-display font-semibold text-3xl sm:text-5xl text-ink-primary tracking-[-0.03em] leading-[0.95]'
							style={{ fontVariationSettings: '"opsz" 96' }}
						>
							{draft.title || 'Untitled course'}
						</h2>
					</div>
				</div>
				<div className='px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center'>
					<div>
						<p className='font-display font-semibold text-2xl text-ink-primary tabular-nums'>
							{draft.modules.length}
						</p>
						<p className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>Modules</p>
					</div>
					<div>
						<p className='font-display font-semibold text-2xl text-ink-primary tabular-nums'>
							{totalLessons}
						</p>
						<p className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>Lessons</p>
					</div>
					<div>
						<p className='font-display font-semibold text-2xl text-ink-primary tabular-nums'>
							{draft.outcomes.filter((o) => o.trim()).length}
						</p>
						<p className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>Outcomes</p>
					</div>
					<div>
						<p className='font-display font-semibold text-2xl text-ink-primary tabular-nums'>
							{draft.pricingType === 'free' ? 'Free' : `$${draft.price.toFixed(0)}`}
						</p>
						<p className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>Price</p>
					</div>
				</div>
			</section>

			{/* Checklist */}
			<section>
				<h3 className='mb-4 font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
					Pre-publish checklist
				</h3>
				<ul className='space-y-1'>
					{checks.map((c, i) => (
						<li key={i}>
							<button
								type='button'
								onClick={() => onJumpToStep(c.step)}
								className='w-full text-left px-4 py-2.5 rounded-card hover:bg-bg-overlay/40 flex items-center gap-3 transition-colors'
							>
								<span
									className={cn(
										'inline-grid place-items-center h-6 w-6 rounded-full',
										c.ok ? 'bg-signal-success/15 text-signal-success' : 'bg-sienna-500/15 text-sienna-400',
									)}
								>
									{c.ok ? <Check size={12} strokeWidth={2.5} /> : <AlertCircle size={12} strokeWidth={2} />}
								</span>
								<span className='flex-1 font-body text-sm text-ink-primary'>{c.label}</span>
								<span className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
									{BUILDER_STEPS.find((s) => s.key === c.step)?.label}
								</span>
							</button>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
};
