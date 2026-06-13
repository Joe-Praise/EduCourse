import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';
import { Reveal } from '../../patterns/Reveal/Reveal';

export const FinalCTA = () => (
	<section className='py-32 sm:py-40 lg:py-48 relative isolate overflow-hidden'>
		<div
			aria-hidden
			className='absolute inset-0 -z-10 opacity-60'
			style={{
				background:
					'radial-gradient(ellipse at center top, rgba(200,71,46,0.18) 0%, transparent 55%), radial-gradient(ellipse at center bottom, rgba(184,153,104,0.10) 0%, transparent 60%)',
			}}
		/>
		<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center'>
			<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
				Start the work
			</span>
			<Reveal mode='word-split' as='h2' className='mt-6 font-display italic font-semibold text-ink-primary leading-[0.95] tracking-[-0.04em]'>
				<span style={{ fontSize: 'clamp(64px, 9vw, 132px)', fontVariationSettings: '"opsz" 144' }}>
					You don't need permission.
				</span>
			</Reveal>
			<p className='mt-8 max-w-xl mx-auto font-body text-lg text-ink-secondary leading-[1.6]'>
				No application form, no waiting list. Pick a course, watch the first
				lesson on us, decide whether to keep going.
			</p>

			<div className='mt-12 flex flex-wrap items-center justify-center gap-4'>
				<Magnetic strength={0.3}>
					<Link
						to='/signup'
						data-cursor='grow'
						className='inline-flex items-center gap-2 h-14 px-8 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-base transition-colors duration-base'
					>
						Create your account
						<ArrowRight size={18} strokeWidth={2} />
					</Link>
				</Magnetic>

				<Link
					to='/courses'
					className='font-body text-sm text-ink-tertiary hover:text-ink-primary transition-colors'
				>
					or browse without signing up →
				</Link>
			</div>
		</div>
	</section>
);
