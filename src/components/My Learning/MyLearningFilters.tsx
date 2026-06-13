import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, Check, X } from 'lucide-react';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/reducers';
import {
	removeMyLearningQueryFilterAction,
	setMyLearningQueryFilterAction,
} from '../../redux/actions/courseAction';
import { OmittedCategoryDataType } from '../../redux/api/categoryApi';
import { OmittedInstructorDataType } from '../../redux/api/instructorApi';
import { resolveInstructor } from '../../util/helperFunctions/instructorDisplay';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import { cn } from '../../lib/cn';

interface Option {
	value: string;
	label: string;
}

/** Query-string key each filter group writes to (matches the backend params). */
const KEY = {
	category: 'category',
	instructors: 'instructors',
	progress: 'completed',
} as const;

const PROGRESS_OPTIONS: Option[] = [
	{ value: 'inprogress', label: 'In progress' },
	{ value: 'completed', label: 'Completed' },
];

// ─── Single dropdown ──────────────────────────────────────────────────────────
interface FilterSelectProps {
	label: string;
	options: Option[];
	selected: string;
	onSelect: (value: string) => void;
}

const FilterSelect = ({ label, options, selected, onSelect }: FilterSelectProps) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!open) return;
		const onDocClick = (e: globalThis.MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
		document.addEventListener('mousedown', onDocClick);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('mousedown', onDocClick);
			document.removeEventListener('keydown', onKey);
		};
	}, [open]);

	const selectedLabel = options.find((o) => o.value === selected)?.label;
	const isActive = Boolean(selectedLabel);

	return (
		<div ref={ref} className='relative'>
			<button
				type='button'
				onClick={() => setOpen((v) => !v)}
				aria-haspopup='listbox'
				aria-expanded={open}
				className={cn(
					'inline-flex items-center gap-2 h-11 pl-4 pr-3 rounded-pill border font-body text-sm transition-colors duration-base',
					isActive
						? 'border-clay-500/50 bg-clay-500/10 text-ink-primary'
						: 'border-line-base bg-bg-raised text-ink-secondary hover:text-ink-primary hover:border-line-strong',
				)}
			>
				<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
					{label}
				</span>
				{selectedLabel && (
					<span className='max-w-[140px] truncate text-ink-primary'>{selectedLabel}</span>
				)}
				<ChevronDown
					size={15}
					strokeWidth={2}
					className={cn(
						'transition-transform duration-base ease-out-quart text-ink-tertiary',
						open && 'rotate-180',
					)}
				/>
			</button>

			{open && (
				<ul
					role='listbox'
					className='absolute left-0 top-[calc(100%+8px)] z-30 min-w-[230px] max-h-[320px] overflow-auto rounded-card border border-line-base bg-bg-overlay p-1.5 shadow-warm-3 animate-scaleIn origin-top'
				>
					{options.length === 0 && (
						<li className='px-3 py-2.5 font-body text-sm text-ink-tertiary'>
							Nothing to filter by yet
						</li>
					)}
					{options.map((o) => {
						const active = o.value === selected;
						return (
							<li key={o.value}>
								<button
									type='button'
									role='option'
									aria-selected={active}
									onClick={() => {
										onSelect(o.value);
										setOpen(false);
									}}
									className={cn(
										'flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left font-body text-sm transition-colors duration-fast',
										active
											? 'bg-clay-500/15 text-ink-primary'
											: 'text-ink-secondary hover:bg-line-subtle hover:text-ink-primary',
									)}
								>
									<span className='truncate'>{o.label}</span>
									{active && <Check size={15} strokeWidth={2.4} className='shrink-0 text-clay-400' />}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

// ─── Filter bar + active chips ────────────────────────────────────────────────
interface MyLearningFiltersProps {
	categories?: OmittedCategoryDataType[];
	instructors?: OmittedInstructorDataType[];
}

const MyLearningFilters = ({ categories, instructors }: MyLearningFiltersProps) => {
	const dispatch: AppDispatch = useDispatch();
	const filter = useSelector(
		(state: RootState) => state.course.myLearningQueryFilter,
	) as Record<string, string>;

	const categoryOptions: Option[] = (categories ?? []).map((c) => ({
		value: c._id,
		label: capitalizeFirstLetters(c.name ?? 'Category'),
	}));
	const instructorOptions: Option[] = (instructors ?? []).map((i) => ({
		value: i._id,
		label: resolveInstructor(i).name,
	}));

	// Toggle: selecting the active value again clears it.
	const handleSelect = (key: string) => (value: string) => {
		if (filter[key] === value) {
			dispatch(removeMyLearningQueryFilterAction({ [key]: value }));
		} else {
			dispatch(setMyLearningQueryFilterAction({ [key]: value }));
		}
	};

	const labelFor = (key: string, value: string): string => {
		if (key === KEY.category)
			return categoryOptions.find((o) => o.value === value)?.label ?? 'Category';
		if (key === KEY.instructors)
			return instructorOptions.find((o) => o.value === value)?.label ?? 'Instructor';
		if (key === KEY.progress)
			return PROGRESS_OPTIONS.find((o) => o.value === value)?.label ?? value;
		return value;
	};

	const activeEntries = Object.entries(filter ?? {}).filter(([, v]) => Boolean(v));

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-wrap items-center gap-3'>
				<FilterSelect
					label='Category'
					options={categoryOptions}
					selected={filter[KEY.category] ?? ''}
					onSelect={handleSelect(KEY.category)}
				/>
				<FilterSelect
					label='Instructor'
					options={instructorOptions}
					selected={filter[KEY.instructors] ?? ''}
					onSelect={handleSelect(KEY.instructors)}
				/>
				<FilterSelect
					label='Progress'
					options={PROGRESS_OPTIONS}
					selected={filter[KEY.progress] ?? ''}
					onSelect={handleSelect(KEY.progress)}
				/>
			</div>

			{activeEntries.length > 0 && (
				<div className='flex flex-wrap items-center gap-2'>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
						Filtering by
					</span>
					{activeEntries.map(([key, value]) => (
						<button
							key={key}
							type='button'
							onClick={() => dispatch(removeMyLearningQueryFilterAction({ [key]: value }))}
							className='group inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-pill bg-clay-500/12 border border-clay-500/30 text-ink-primary font-body text-xs transition-colors hover:bg-clay-500/20'
						>
							{labelFor(key, value)}
							<X
								size={13}
								strokeWidth={2.4}
								className='text-clay-400 transition-transform duration-fast group-hover:rotate-90'
							/>
						</button>
					))}
					{activeEntries.length > 1 && (
						<button
							type='button'
							onClick={() =>
								activeEntries.forEach(([key, value]) =>
									dispatch(removeMyLearningQueryFilterAction({ [key]: value })),
								)
							}
							className='inline-flex items-center h-8 px-3 rounded-pill font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary hover:text-ink-primary transition-colors'
						>
							Clear all
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default MyLearningFilters;
