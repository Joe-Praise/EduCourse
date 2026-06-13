import { useEffect, useRef, useState, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from '../../lib/motion';
import { Surface, IconButton, Text } from '../../ui';
import { cn } from '../../lib/cn';
import useDebounce from '../../hooks/UseDebounce';
import {
	getAutoCompleteAllCourseAction,
	resetAutoCompleteAction,
} from '../../redux/actions/courseAction';
import { AppDispatch, RootState } from '../../redux/store';

interface PaletteResult {
	id: string;
	title: string;
	type: 'course';
	slug: string;
}

export function CommandPalette() {
	const [open, setOpen] = useState<boolean>(false);
	const [render, setRender] = useState<boolean>(false);
	const [query, setQuery] = useState<string>('');
	const [activeIndex, setActiveIndex] = useState<number>(0);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const rootRef = useRef<HTMLDivElement | null>(null);

	const debouncedQuery = useDebounce(query);
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();
	const autocomplete = useSelector((state: RootState) => state.course.autoComplete);

	const results = useMemo<PaletteResult[]>(() => {
		if (!autocomplete) return [];
		return (autocomplete as ReadonlyArray<{ _id: string; title: string; slug: string }>)
			.slice(0, 8)
			.map((c) => ({
				id: c._id,
				title: c.title,
				type: 'course' as const,
				slug: c.slug,
			}));
	}, [autocomplete]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				setOpen((v) => !v);
				return;
			}
			if (e.key === 'Escape' && open) {
				e.preventDefault();
				setOpen(false);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	useEffect(() => {
		if (open) {
			setRender(true);
			setActiveIndex(0);
		}
	}, [open]);

	useEffect(() => {
		if (render && open) {
			const t = window.setTimeout(() => inputRef.current?.focus(), 80);
			return () => window.clearTimeout(t);
		}
	}, [render, open]);

	useEffect(() => {
		if (debouncedQuery.length >= 2) {
			dispatch(getAutoCompleteAllCourseAction(debouncedQuery));
		} else {
			dispatch(resetAutoCompleteAction());
		}
	}, [dispatch, debouncedQuery]);

	useGSAP(
		() => {
			if (!render) return;
			const root = rootRef.current;
			if (!root) return;
			const backdrop = root.querySelector<HTMLElement>('[data-cmdk-backdrop]');
			const panel = root.querySelector<HTMLElement>('[data-cmdk-panel]');
			if (!backdrop || !panel) return;
			if (open) {
				gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.16 });
				gsap.fromTo(
					panel,
					{ y: 12, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.32, ease: 'power3.out' },
				);
			} else {
				gsap.to(backdrop, { opacity: 0, duration: 0.16 });
				gsap.to(panel, {
					y: 8,
					opacity: 0,
					duration: 0.2,
					ease: 'power2.in',
					onComplete: () => {
						setRender(false);
						setQuery('');
					},
				});
			}
		},
		{ scope: rootRef, dependencies: [open, render] },
	);

	const handleSelect = (r: PaletteResult) => {
		setOpen(false);
		navigate(`/courses/${r.slug}`);
	};

	const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveIndex((i) => Math.min(i + 1, results.length - 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveIndex((i) => Math.max(i - 1, 0));
		} else if (e.key === 'Enter' && results[activeIndex]) {
			e.preventDefault();
			handleSelect(results[activeIndex]);
		}
	};

	if (!render) return null;

	return (
		<div
			ref={rootRef}
			className='fixed inset-0 z-50 grid place-items-start pt-[15vh] p-4'
			role='dialog'
			aria-modal='true'
			aria-label='Command palette'
		>
			<div
				data-cmdk-backdrop
				onClick={() => setOpen(false)}
				className='absolute inset-0 bg-black/70 backdrop-blur-sm'
			/>
			<div data-cmdk-panel className='relative w-full max-w-2xl'>
				<Surface level='overlay' className='shadow-elev-3 overflow-hidden'>
					<div className='flex items-center gap-3 px-5 py-4 border-b border-line-subtle'>
						<Search size={16} className='text-ink-tertiary shrink-0' />
						<input
							ref={inputRef}
							type='text'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={handleInputKey}
							placeholder='Search courses, lessons, instructors…'
							className='flex-1 bg-transparent outline-none text-ink-primary placeholder:text-ink-muted font-body text-base'
						/>
						<kbd className='hidden sm:inline-flex h-6 px-1.5 items-center rounded-md bg-bg-raised border border-line-base font-mono text-2xs text-ink-tertiary'>
							ESC
						</kbd>
						<IconButton
							aria-label='Close command palette'
							size='sm'
							variant='ghost'
							onClick={() => setOpen(false)}
						>
							<X size={14} />
						</IconButton>
					</div>

					<div className='max-h-[50vh] overflow-y-auto'>
						{query.length < 2 ? (
							<div className='py-12 text-center'>
								<Text variant='body-sm' tone='tertiary'>
									Start typing to search across courses
								</Text>
							</div>
						) : results.length === 0 ? (
							<div className='py-12 text-center'>
								<Text variant='body-sm' tone='tertiary'>
									No matches for &ldquo;{query}&rdquo;
								</Text>
							</div>
						) : (
							<ul className='py-2'>
								{results.map((r, i) => {
									const isActive = i === activeIndex;
									return (
										<li key={r.id}>
											<button
												type='button'
												onMouseEnter={() => setActiveIndex(i)}
												onClick={() => handleSelect(r)}
												className={cn(
													'w-full flex items-center justify-between gap-3 px-5 py-2.5 text-left',
													'transition-colors duration-fast ease-out-quart',
													isActive ? 'bg-brand-500/10 text-ink-primary' : 'text-ink-secondary',
												)}
											>
												<span className='flex flex-col min-w-0'>
													<span className='font-body text-sm truncate'>{r.title}</span>
													<span className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary mt-0.5'>
														Course
													</span>
												</span>
												<ArrowRight size={14} className='shrink-0 text-ink-tertiary' />
											</button>
										</li>
									);
								})}
							</ul>
						)}
					</div>

					<div className='flex items-center justify-between px-5 py-3 border-t border-line-subtle bg-bg-base/40'>
						<Text variant='body-2xs' tone='tertiary'>
							<kbd className='inline-block px-1 mx-0.5 rounded bg-bg-raised border border-line-base font-mono'>↑↓</kbd>
							{' '}navigate{' '}
							<kbd className='inline-block px-1 mx-0.5 rounded bg-bg-raised border border-line-base font-mono'>↵</kbd>
							{' '}select
						</Text>
						<Text variant='body-2xs' tone='tertiary'>
							<kbd className='inline-block px-1 rounded bg-bg-raised border border-line-base font-mono'>⌘K</kbd>
						</Text>
					</div>
				</Surface>
			</div>
		</div>
	);
}
