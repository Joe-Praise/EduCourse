import { Check, Star } from 'lucide-react';
import { FilterType } from './type';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import {
	resolveInstructor,
	type InstructorLike,
} from '../../util/helperFunctions/instructorDisplay';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
	removeQueryFilterAction,
	setQueryFilterAction,
} from '../../redux/actions/courseAction';
import { useLocation } from 'react-router-dom';
import {
	removeBlogQueryFilterAction,
	setBlogQueryFilterAction,
} from '../../redux/actions/blogAction';
import { cn } from '../../lib/cn';

interface Iprop {
	header: string;
	values: any[];
}

// The redux/query key each filter group writes to.
const keyFor = (header: string): string =>
	header === 'Price'
		? 'priceCategory'
		: header === 'Review'
			? 'ratingsAverage[gte]'
			: header;

const FilterActionList = (props: Iprop) => {
	const location = useLocation();
	const dispatch: AppDispatch = useDispatch();
	const { values, header } = props;
	const isBlog = location.pathname.startsWith('/blog');

	// Read the active selection from redux so checkmarks survive re-opening the
	// panel (the old local-state version reset every time).
	const courseFilter = useSelector(
		(s: RootState) => s.course.queryFilter as Record<string, string | number>,
	);
	const blogFilter = useSelector(
		(s: RootState) =>
			(s as RootState & { blog?: { queryFilter?: Record<string, string | number> } })
				.blog?.queryFilter ?? {},
	);
	const queryFilter = isBlog ? blogFilter : courseFilter;

	const queryKey = keyFor(header);
	const selectedId = String(queryFilter?.[queryKey] ?? '');
	const isActive = (el: FilterType) => selectedId !== '' && selectedId === String(el._id);

	const handleChange = (data: FilterType) => {
		const obj = { [queryKey]: String(data._id) };
		if (isActive(data)) {
			if (isBlog) dispatch(removeBlogQueryFilterAction(obj));
			else dispatch(removeQueryFilterAction(obj));
		} else {
			if (isBlog) dispatch(setBlogQueryFilterAction(obj));
			else dispatch(setQueryFilterAction(obj));
		}
	};

	// ── Tags — pill cloud ──────────────────────────────────────────────────
	if (header === 'Tag') {
		return (
			<ul className='list-none flex flex-wrap gap-2'>
				{values?.map((el) => {
					const on = isActive(el);
					return (
						<li key={el?._id}>
							<button
								type='button'
								onClick={() => handleChange(el)}
								className={cn(
									'inline-flex items-center h-8 px-3 rounded-pill font-body text-xs transition-colors',
									on
										? 'bg-clay-500 text-ink-primary'
										: 'bg-bg-overlay/50 text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay',
								)}
							>
								{el.name}
							</button>
						</li>
					);
				})}
			</ul>
		);
	}

	// ── Review — selectable star rows ──────────────────────────────────────
	if (header === 'Review') {
		return (
			<ul className='list-none flex flex-col gap-0.5'>
				{values?.map((el) => {
					const on = isActive(el);
					return (
						<li key={el?._id}>
							<button
								type='button'
								onClick={() => handleChange(el)}
								className={cn(
									'group w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors',
									on ? 'bg-clay-500/10' : 'hover:bg-bg-overlay/50',
								)}
							>
								<span className='flex items-center gap-1'>
									{[1, 2, 3, 4, 5].map((s) => (
										<Star
											key={s}
											size={14}
											strokeWidth={1.5}
											className={cn(
												s <= Number(el._id)
													? 'fill-clay-500 text-clay-500'
													: 'fill-transparent text-line-strong',
											)}
										/>
									))}
								</span>
								<span className='font-body text-xs text-ink-tertiary'>&amp; up</span>
								{on && <Check size={14} strokeWidth={2.5} className='ml-auto text-clay-400' />}
							</button>
						</li>
					);
				})}
			</ul>
		);
	}

	// ── Default — checkbox rows (Category / Price / Level / Instructors) ────
	return (
		<ul className='list-none flex flex-col gap-0.5'>
			{values?.map((el) => {
				const on = isActive(el);
				const instructor = header === 'Instructors';
				const display = instructor ? resolveInstructor(el as InstructorLike) : null;
				const label = instructor
					? capitalizeFirstLetters(display!.name)
					: capitalizeFirstLetters(el?.name);
				return (
					<li key={el?._id}>
						<button
							type='button'
							onClick={() => handleChange(el)}
							className={cn(
								'group w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors',
								on ? 'bg-clay-500/10' : 'hover:bg-bg-overlay/50',
							)}
						>
							<span
								aria-hidden
								className={cn(
									'grid place-items-center h-[18px] w-[18px] rounded-[5px] border shrink-0 transition-all',
									on
										? 'bg-clay-500 border-clay-500'
										: 'border-line-strong group-hover:border-clay-400',
								)}
							>
								{on && <Check size={12} strokeWidth={3} className='text-ink-primary' />}
							</span>

							{instructor && (
								<img
									src={imgSrc(display!.photo, '/img/', TRANSFORMS.avatarSm)}
									alt=''
									className='h-6 w-6 rounded-full object-cover bg-bg-raised shrink-0'
									loading='lazy'
								/>
							)}

							<span
								className={cn(
									'flex-1 min-w-0 truncate font-body text-sm transition-colors',
									on ? 'text-ink-primary' : 'text-ink-secondary group-hover:text-ink-primary',
								)}
							>
								{label}
							</span>
						</button>
					</li>
				);
			})}
		</ul>
	);
};

export default FilterActionList;
