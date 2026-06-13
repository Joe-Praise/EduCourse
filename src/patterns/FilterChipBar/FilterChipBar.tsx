import { Chip } from '../../ui';
import { cn } from '../../lib/cn';

export interface ActiveFilter {
	key: string;
	label: string;
	onRemove: () => void;
}

interface FilterChipBarProps {
	chips: ActiveFilter[];
	onClearAll?: () => void;
	className?: string;
}

export const FilterChipBar = ({ chips, onClearAll, className }: FilterChipBarProps) => {
	if (chips.length === 0) return null;

	return (
		<div
			role='region'
			aria-label='Active filters'
			className={cn('flex flex-wrap items-center gap-2', className)}
		>
			{chips.map((chip) => (
				<Chip key={chip.key} selected removable onRemove={chip.onRemove}>
					{chip.label}
				</Chip>
			))}
			{onClearAll && chips.length > 1 && (
				<button
					type='button'
					onClick={onClearAll}
					className='ml-1 text-xs font-medium text-ink-tertiary hover:text-ink-primary transition-colors'
				>
					Clear all
				</button>
			)}
		</div>
	);
};
