import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, BookOpen, FileText, ArrowUpRight } from 'lucide-react';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { LoadingEffect } from '../../components/shared';
import {
	unifiedSearchApi,
	SearchResult,
	SearchResultBlog,
	SearchResultCourse,
} from '../../redux/api/searchApi';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import useDebounce from '../../hooks/UseDebounce';

type FetchState = 'idle' | 'loading' | 'ready' | 'error';

const SearchPage: FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const initialQ = searchParams.get('q') ?? '';

	const [input, setInput] = useState(initialQ);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [status, setStatus] = useState<FetchState>('idle');
	const debounced = useDebounce(input, 350);

	useEffect(() => {
		const trimmed = debounced.trim();
		// Sync URL — keep the page bookmarkable.
		setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });

		if (trimmed.length < 2) {
			setResults([]);
			setStatus('idle');
			return;
		}

		let cancelled = false;
		setStatus('loading');
		unifiedSearchApi(trimmed).then((response) => {
			if (cancelled) return;
			if ('error' in response && response.error) {
				setStatus('error');
				setResults([]);
				return;
			}
			setResults((response as { data: SearchResult[] }).data ?? []);
			setStatus('ready');
		});

		return () => {
			cancelled = true;
		};
	}, [debounced, setSearchParams]);

	const { courses, blogs } = useMemo(() => {
		const cs: SearchResultCourse[] = [];
		const bs: SearchResultBlog[] = [];
		for (const r of results) {
			if (r.type === 'course') cs.push(r);
			else if (r.type === 'blog') bs.push(r);
		}
		return { courses: cs, blogs: bs };
	}, [results]);

	const totalResults = courses.length + blogs.length;
	const trimmedQuery = debounced.trim();
	const showEmpty = status === 'ready' && totalResults === 0 && trimmedQuery.length >= 2;
	const showPrompt = status === 'idle' && trimmedQuery.length < 2;

	return (
		<PageLayout width='default' className='pt-16 sm:pt-24 pb-24'>
			<header className='mb-10'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					{trimmedQuery ? `Searching · "${trimmedQuery}"` : 'Search'}
				</span>
				<Reveal
					mode='word-split'
					as='h1'
					className='mt-3 font-display font-semibold text-5xl sm:text-6xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
				>
					What are you looking for?
				</Reveal>
			</header>

			{/* Search input */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const t = input.trim();
					if (t) navigate(`/search?q=${encodeURIComponent(t)}`);
				}}
				className='mb-12'
			>
				<div className='glass rounded-pill px-2 py-2 flex items-center gap-2 max-w-2xl shadow-warm-2'>
					<span className='inline-grid place-items-center h-10 w-10 text-ink-secondary'>
						<SearchIcon size={16} strokeWidth={2} />
					</span>
					<input
						type='search'
						autoFocus
						placeholder='Search courses, articles, instructors…'
						value={input}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
						className='flex-1 bg-transparent outline-none text-ink-primary placeholder:text-ink-tertiary font-body text-sm'
					/>
					{input.length > 0 && (
						<button
							type='button'
							onClick={() => setInput('')}
							className='h-8 w-8 rounded-full grid place-items-center text-ink-tertiary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors text-xs'
							aria-label='Clear'
						>
							✕
						</button>
					)}
				</div>
			</form>

			{showPrompt && (
				<p className='font-body text-ink-tertiary'>
					Type at least 2 characters to search.
				</p>
			)}

			{status === 'loading' && (
				<div className='py-16 grid place-items-center'>
					<LoadingEffect />
				</div>
			)}

			{status === 'error' && (
				<div className='py-16 text-center'>
					<p className='font-body text-sm text-signal-danger'>
						Search failed. Try again.
					</p>
				</div>
			)}

			{showEmpty && (
				<div className='py-16 text-center'>
					<h3 className='font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'>
						No results for &quot;{trimmedQuery}&quot;.
					</h3>
					<p className='mt-2 font-body text-sm text-ink-tertiary'>
						Try a different term — or browse the{' '}
						<Link to='/courses' className='text-clay-400 hover:text-clay-500'>
							catalog
						</Link>{' '}
						or the{' '}
						<Link to='/blogs' className='text-clay-400 hover:text-clay-500'>
							archive
						</Link>
						.
					</p>
				</div>
			)}

			{status === 'ready' && totalResults > 0 && (
				<div className='space-y-16'>
					{/* Courses section */}
					{courses.length > 0 && (
						<section>
							<header className='mb-6 flex items-center gap-2'>
								<BookOpen size={14} strokeWidth={2} className='text-clay-400' />
								<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
									Courses · {courses.length}
								</span>
							</header>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
								{courses.map((c) => (
									<Link
										key={c._id}
										to={`/courses/${c.slug}`}
										className='group block rounded-card border border-line-subtle bg-bg-raised hover:border-line-base hover:bg-bg-overlay/40 transition-[border-color,background-color] duration-base ease-out-quart overflow-hidden'
									>
										<div className='aspect-[16/10] relative overflow-hidden bg-bg-sunken'>
											{c.imageCover ? (
												<img
													src={imgSrc(c.imageCover, '/course/', TRANSFORMS.courseCoverCard)}
													alt=''
													loading='lazy'
													className='absolute inset-0 h-full w-full object-cover'
												/>
											) : (
												<div className='absolute inset-0 bg-gradient-to-br from-clay-500/20 via-sienna-500/10 to-bg-sunken' />
											)}
										</div>
										<div className='p-5'>
											<div className='flex items-center justify-between gap-2 mb-2'>
												<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
													{c.level ?? 'Course'}
												</span>
												{typeof c.ratingsAverage === 'number' && c.ratingsAverage > 0 && (
													<span className='font-mono text-2xs uppercase tracking-[0.18em] text-clay-400 tabular-nums'>
														★ {c.ratingsAverage.toFixed(1)}
													</span>
												)}
											</div>
											<h3
												className='font-display font-semibold text-lg text-ink-primary tracking-[-0.01em] leading-[1.2] line-clamp-2'
												style={{ fontVariationSettings: '"opsz" 32' }}
											>
												{c.title}
											</h3>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{/* Blogs section */}
					{blogs.length > 0 && (
						<section>
							<header className='mb-6 flex items-center gap-2'>
								<FileText size={14} strokeWidth={2} className='text-clay-400' />
								<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
									Articles · {blogs.length}
								</span>
							</header>
							<ul className='space-y-3'>
								{blogs.map((b) => {
									const categoryName =
										typeof b.category === 'object' && b.category !== null
											? b.category.name
											: b.category;
									return (
										<li key={b._id}>
											<Link
												to={`/blogs/${b.slug}`}
												className='group flex items-center gap-4 p-4 rounded-card border border-line-subtle bg-bg-raised hover:border-line-base hover:bg-bg-overlay/40 transition-[border-color,background-color] duration-base ease-out-quart'
											>
												<div className='w-20 h-14 rounded-md overflow-hidden bg-bg-sunken flex-shrink-0'>
													{b.imageCover && (
														<img
															src={imgSrc(b.imageCover, '/blog/', TRANSFORMS.blogCoverCard)}
															alt=''
															loading='lazy'
															className='w-full h-full object-cover'
														/>
													)}
												</div>
												<div className='flex-1 min-w-0'>
													{categoryName && (
														<span className='font-mono text-2xs uppercase tracking-[0.18em] text-clay-400'>
															{categoryName}
														</span>
													)}
													<h3
														className='mt-1 font-display font-semibold text-base text-ink-primary tracking-[-0.01em] line-clamp-2'
														style={{ fontVariationSettings: '"opsz" 32' }}
													>
														{b.title}
													</h3>
												</div>
												<ArrowUpRight
													size={16}
													strokeWidth={1.75}
													className='text-ink-tertiary group-hover:text-clay-400 transition-colors shrink-0'
												/>
											</Link>
										</li>
									);
								})}
							</ul>
						</section>
					)}
				</div>
			)}
		</PageLayout>
	);
};

export default SearchPage;
