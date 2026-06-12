import { useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { TextAreaField } from './BuilderField';
import { SortableList } from '../SortableList';
import { type CourseDraft } from '../types';
import { cn } from '../../../lib/cn';

interface StepOutcomesProps {
	draft: CourseDraft;
	update: <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => void;
}

const MAX_OUTCOMES = 8;

interface OutcomeRow {
	id: string;
	idx: number;
	text: string;
}

export const StepOutcomes = ({ draft, update }: StepOutcomesProps) => {
	const rows = useMemo<OutcomeRow[]>(
		() => draft.outcomes.map((text, idx) => ({ id: `outcome-${idx}-${text.slice(0, 8)}`, idx, text })),
		[draft.outcomes],
	);

	const setOutcomeAt = (idx: number, value: string) => {
		const next = [...draft.outcomes];
		next[idx] = value;
		update('outcomes', next);
	};
	const addOutcome = () => {
		if (draft.outcomes.length >= MAX_OUTCOMES) return;
		update('outcomes', [...draft.outcomes, '']);
	};
	const removeOutcome = (idx: number) => {
		update('outcomes', draft.outcomes.filter((_, i) => i !== idx));
	};
	const handleReorder = (next: OutcomeRow[]) => {
		update('outcomes', next.map((r) => r.text));
	};

	return (
		<div className='space-y-12 max-w-2xl'>
			<section>
				<header className='mb-4'>
					<label className='block font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary mb-1'>
						Outcomes <span className='text-clay-400'>*</span>
					</label>
					<p className='font-body text-xs text-ink-tertiary'>
						Up to {MAX_OUTCOMES} concrete things students will be able to do. Drag the handle to reorder.
					</p>
				</header>

				<SortableList items={rows} getId={(r) => r.id} onReorder={handleReorder}>
					{(row) => (
						<div className='flex items-start gap-2'>
							<span className='shrink-0 w-9 h-11 inline-grid place-items-center font-mono text-2xs text-ink-tertiary tabular-nums'>
								{String(row.idx + 1).padStart(2, '0')}
							</span>
							<input
								type='text'
								value={row.text}
								onChange={(e) => setOutcomeAt(row.idx, e.target.value)}
								placeholder={row.idx === 0 ? 'e.g. Build a production-ready API in Go' : 'Another outcome…'}
								className='flex-1 h-11 px-4 rounded-card bg-bg-raised border border-line-base focus:border-line-strong text-ink-primary placeholder:text-ink-tertiary font-body text-sm outline-none focus:shadow-focus-ring transition-[border-color,box-shadow] duration-base'
							/>
							<button
								type='button'
								onClick={() => removeOutcome(row.idx)}
								aria-label='Remove outcome'
								disabled={draft.outcomes.length <= 1}
								className='inline-grid place-items-center h-11 w-9 text-ink-tertiary hover:text-signal-danger disabled:opacity-30 transition-colors'
							>
								<X size={14} strokeWidth={2} />
							</button>
						</div>
					)}
				</SortableList>

				<button
					type='button'
					onClick={addOutcome}
					disabled={draft.outcomes.length >= MAX_OUTCOMES}
					className={cn(
						'mt-3 ml-7 inline-flex items-center gap-2 h-10 px-4 rounded-pill border border-dashed border-line-base text-ink-secondary hover:text-ink-primary hover:border-line-strong font-body text-xs transition-colors',
						draft.outcomes.length >= MAX_OUTCOMES && 'opacity-40 cursor-not-allowed',
					)}
				>
					<Plus size={14} strokeWidth={2} />
					Add outcome
				</button>
			</section>

			<TextAreaField
				label='Prerequisites'
				hint='What should students know before taking this? (Optional)'
				rows={3}
				value={draft.prerequisites}
				onChange={(e) => update('prerequisites', e.target.value)}
				placeholder='e.g. Comfort with basic JavaScript, a code editor installed.'
			/>

			<TextAreaField
				label='Target audience'
				hint='Who is this course for?'
				rows={3}
				value={draft.targetAudience}
				onChange={(e) => update('targetAudience', e.target.value)}
				placeholder='e.g. Designers transitioning into frontend; engineers tired of JIRA tickets.'
			/>
		</div>
	);
};
