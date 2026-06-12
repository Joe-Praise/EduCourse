import { TextField, SelectField } from './BuilderField';
import { type CourseDraft } from '../types';
import { cn } from '../../../lib/cn';

interface StepPricingProps {
	draft: CourseDraft;
	update: <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => void;
}

const CURRENCY_OPTIONS = [
	{ value: 'USD', label: 'USD ($)' },
	{ value: 'EUR', label: 'EUR (€)' },
	{ value: 'GBP', label: 'GBP (£)' },
];

export const StepPricing = ({ draft, update }: StepPricingProps) => {
	return (
		<div className='space-y-10 max-w-2xl'>
			{/* Free / Paid toggle */}
			<section>
				<label className='block font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary mb-3'>
					Pricing model
				</label>
				<div className='grid grid-cols-2 gap-3'>
					{(['free', 'paid'] as const).map((type) => {
						const active = draft.pricingType === type;
						return (
							<button
								key={type}
								type='button'
								onClick={() => update('pricingType', type)}
								className={cn(
									'rounded-card p-5 text-left border transition-colors',
									active
										? 'border-clay-500/50 bg-clay-500/5'
										: 'border-line-subtle bg-bg-raised hover:border-line-base',
								)}
							>
								<p
									className='font-display font-semibold text-2xl text-ink-primary capitalize tracking-[-0.02em]'
									style={{ fontVariationSettings: '"opsz" 32' }}
								>
									{type}
								</p>
								<p className='mt-1 font-body text-xs text-ink-tertiary'>
									{type === 'free'
										? 'Open to anyone with an account.'
										: 'Charge once for lifetime access.'}
								</p>
							</button>
						);
					})}
				</div>
			</section>

			{/* Paid options */}
			{draft.pricingType === 'paid' && (
				<section className='space-y-6'>
					<div className='grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4'>
						<SelectField
							label='Currency'
							options={CURRENCY_OPTIONS}
							value={draft.currency}
							onChange={(e) => update('currency', e.target.value)}
						/>
						<TextField
							label='Price'
							required
							type='number'
							min={1}
							step='0.01'
							value={draft.price || ''}
							onChange={(e) => update('price', parseFloat(e.target.value) || 0)}
							placeholder='49.00'
						/>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<TextField
							label='Discount price (optional)'
							type='number'
							min={0}
							step='0.01'
							value={draft.discountPrice ?? ''}
							onChange={(e) => update('discountPrice', e.target.value ? parseFloat(e.target.value) : null)}
							placeholder='29.00'
							hint='Leave empty for no discount.'
						/>
						<TextField
							label='Discount valid until'
							type='date'
							value={draft.discountValidUntil ?? ''}
							onChange={(e) => update('discountValidUntil', e.target.value || null)}
						/>
					</div>
				</section>
			)}
		</div>
	);
};
