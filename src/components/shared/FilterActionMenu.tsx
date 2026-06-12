import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FilterActionList } from './';
import { RootState } from '../../redux/store';
import { cn } from '../../lib/cn';

interface Iprop {
	header: string;
	values: any[];
}

const keyFor = (header: string): string =>
	header === 'Price'
		? 'priceCategory'
		: header === 'Review'
			? 'ratingsAverage[gte]'
			: header;

/**
 * One collapsible filter section. Editorial chrome: a mono-caps header with a
 * clay "active" dot when this group has a selection, a chevron that rotates on
 * toggle, and a grid-rows height animation for the body.
 */
const FilterActionMenu = ({ header, values }: Iprop) => {
	const [open, setOpen] = useState(true);
	const location = useLocation();
	const isBlog = location.pathname.startsWith('/blog');

	const courseFilter = useSelector(
		(s: RootState) => s.course.queryFilter as Record<string, string | number>,
	);
	const blogFilter = useSelector(
		(s: RootState) =>
			(s as RootState & { blog?: { queryFilter?: Record<string, string | number> } })
				.blog?.queryFilter ?? {},
	);
	const queryFilter = isBlog ? blogFilter : courseFilter;
	const hasSelection = Boolean(queryFilter?.[keyFor(header)]);

	return (
		<div className='border-b border-line-subtle last:border-b-0'>
			<button
				type='button'
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className='group w-full flex items-center justify-between gap-3 py-3.5'
			>
				<span className='flex items-center gap-2'>
					<span className='font-mono text-2xs uppercase tracking-[0.2em] text-ink-secondary group-hover:text-ink-primary transition-colors'>
						{header}
					</span>
					{hasSelection && (
						<span aria-hidden className='inline-block h-1.5 w-1.5 rounded-full bg-clay-500' />
					)}
				</span>
				<ChevronDown
					size={15}
					strokeWidth={2}
					className={cn(
						'text-ink-tertiary group-hover:text-ink-primary transition-transform duration-base ease-out-quart',
						open && 'rotate-180',
					)}
				/>
			</button>

			{/* grid-rows height animation — no magic max-height */}
			<div
				className={cn(
					'grid transition-[grid-template-rows] duration-base ease-out-quart',
					open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
				)}
			>
				<div className='overflow-hidden'>
					<div className='pb-3'>
						<FilterActionList values={values} header={header} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterActionMenu;
