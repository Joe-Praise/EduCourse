import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const NotFound: FC = () => {
	return (
		<section className='relative min-h-svh bg-bg-base overflow-hidden flex items-center'>
			{/* Soft persona-color wash, top-right */}
			<div
				aria-hidden
				className='absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full blur-3xl pointer-events-none'
				style={{
					background:
						'radial-gradient(circle at center, rgba(200,71,46,0.18) 0%, transparent 65%)',
				}}
			/>

			{/* Inset frame */}
			<div className='absolute inset-6 sm:inset-10 border border-line-subtle pointer-events-none' />

			{/* Top-left section number */}
			<div className='absolute top-10 sm:top-14 left-10 sm:left-14 flex items-baseline gap-3'>
				<span
					aria-hidden
					className='font-mono font-medium tabular-nums leading-none text-ink-secondary'
					style={{ fontSize: 'clamp(28px, 3.4vw, 52px)', letterSpacing: '-0.02em' }}
				>
					ERR
				</span>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
					/ 404
				</span>
			</div>

			{/* Top-right stamp */}
			<div className='absolute top-10 sm:top-14 right-10 sm:right-14 flex items-center gap-2'>
				<span aria-hidden className='h-1.5 w-1.5 rounded-full bg-clay-500' />
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
					EduCourse · Lost
				</span>
			</div>

			{/* Hero composition */}
			<div className='relative w-full max-w-container mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
				{/* Big italic 404 — bleeding off-right */}
				<span
					aria-hidden
					className='absolute font-display italic font-semibold text-clay-400 leading-none select-none opacity-[0.18]'
					style={{
						fontSize: 'clamp(280px, 36vw, 520px)',
						letterSpacing: '-0.08em',
						fontVariationSettings: '"opsz" 144',
						right: '-6%',
						top: '50%',
						transform: 'translateY(-50%) rotate(-3deg)',
					}}
				>
					404
				</span>

				{/* Text column */}
				<div className='relative z-10 lg:col-span-7 flex flex-col gap-7'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						Off the page
					</span>
					<h1
						className='font-display font-semibold text-ink-primary tracking-[-0.04em] leading-[0.92]'
						style={{
							fontSize: 'clamp(56px, 8.5vw, 140px)',
							fontVariationSettings: '"opsz" 144',
						}}
					>
						Lost the&nbsp;
						<span className='italic text-clay-400'>thread</span>.
					</h1>
					<p
						className='font-body text-ink-secondary leading-[1.55] max-w-md'
						style={{ fontSize: 'clamp(16px, 1.4vw, 18px)' }}
					>
						This route doesn&apos;t exist anymore — or maybe it never did. Try one
						of the doors below instead.
					</p>

					<div className='flex flex-wrap items-center gap-3 mt-2'>
						<Link
							to='/'
							className='inline-flex items-center gap-2 h-12 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Take me home
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
						<Link
							to='/courses'
							className='inline-flex items-center gap-2 h-12 px-6 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Browse the catalog
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
					</div>
				</div>
			</div>

			{/* Bottom-left credit */}
			<div className='absolute bottom-10 sm:bottom-14 left-10 sm:left-14 flex items-end gap-3'>
				<span aria-hidden className='block w-px h-12 bg-line-base' />
				<div className='flex flex-col gap-1.5 mb-0.5'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary'>
						Status code
					</span>
					<span
						className='font-display italic font-medium text-ink-secondary leading-none'
						style={{ fontSize: 'clamp(16px, 1.4vw, 20px)', fontVariationSettings: '"opsz" 36' }}
					>
						Not found.
					</span>
				</div>
			</div>

			{/* Bottom-right folio mark */}
			<div className='absolute bottom-10 sm:bottom-14 right-10 sm:right-14'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-ink-tertiary tabular-nums'>
					404 — ∞
				</span>
			</div>

			{/* Scanline texture */}
			<div
				aria-hidden
				className='absolute inset-0 pointer-events-none'
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg, rgba(245,239,227,0.03) 0px, rgba(245,239,227,0.03) 1px, transparent 1px, transparent 4px)',
				}}
			/>
		</section>
	);
};

export default NotFound;
