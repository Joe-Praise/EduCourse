import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/motion';
import { ImageClipReveal } from '../../patterns/ImageClipReveal/ImageClipReveal';
import { cn } from '../../lib/cn';

interface PinnedStoryProps {
	persona: 'learner' | 'instructor' | 'team';
	eyebrow: string;
	headline: string;
	body: string;
	imageSide: 'left' | 'right';
	tone?: 'dark' | 'paper';
	imageSrc?: string;
}

const personaMeta: Record<
	PinnedStoryProps['persona'],
	{ initial: string; section: string; label: string }
> = {
	learner: { initial: 'L', section: '01', label: 'The learner' },
	instructor: { initial: 'I', section: '02', label: 'The instructor' },
	team: { initial: 'T', section: '03', label: 'The team' },
};

/**
 * Editorial composition used when no real photography is provided.
 * Layered like a magazine spread: section number, persona label along the edge,
 * a soft persona-colored wash, a big italic initial offset rather than centered,
 * a thin inset frame, and a scanline texture for paper-print feel.
 */
const PlaceholderArt = ({
	persona,
	tone,
}: {
	persona: PinnedStoryProps['persona'];
	tone: 'dark' | 'paper';
}) => {
	const meta = personaMeta[persona];

	// Paper-tone panels lean confidently warmer than the page —
	// a deeper printed version of the cream paper, not a yellower mismatch.
	const bg =
		tone === 'paper'
			? persona === 'learner'
				? 'bg-gradient-to-br from-clay-400/45 via-sienna-300/30 to-ivory-300'
				: persona === 'instructor'
					? 'bg-gradient-to-br from-sienna-400/55 via-sienna-300/35 to-ivory-300'
					: 'bg-gradient-to-br from-sienna-300/45 via-ivory-300 to-ivory-400'
			: persona === 'learner'
				? 'bg-gradient-to-br from-clay-600/40 via-bg-raised to-bg-sunken'
				: persona === 'instructor'
					? 'bg-gradient-to-br from-sienna-600/40 via-bg-raised to-bg-sunken'
					: 'bg-gradient-to-br from-ivory-500/25 via-bg-raised to-bg-sunken';

	const textTone = tone === 'paper' ? 'text-bg-base' : 'text-ink-primary';
	const frameTone = tone === 'paper' ? 'ring-bg-base/15' : 'ring-line-base';
	const innerFrameTone = tone === 'paper' ? 'border-bg-base/10' : 'border-line-subtle';
	const ruleTone = tone === 'paper' ? 'bg-bg-base/25' : 'bg-line-base';

	// Persona accent wash — saturated enough to anchor the panel on cream
	const washColor =
		persona === 'learner'
			? tone === 'paper'
				? 'rgba(200,71,46,0.20)'
				: 'rgba(200,71,46,0.18)'
			: persona === 'instructor'
				? tone === 'paper'
					? 'rgba(150,121,80,0.35)'
					: 'rgba(184,153,104,0.22)'
				: tone === 'paper'
					? 'rgba(184,153,104,0.20)'
					: 'rgba(244,239,216,0.16)';

	return (
		<div className={cn('absolute inset-0 overflow-hidden ring-1 ring-inset', frameTone, bg, textTone)}>
			{/* Persona-color wash — soft warm spotlight from top-right */}
			<div
				aria-hidden
				className='absolute -top-1/3 -right-1/4 w-[80%] h-[80%] rounded-full blur-3xl'
				style={{ background: `radial-gradient(circle at center, ${washColor} 0%, transparent 60%)` }}
			/>

			{/* Inner editorial frame */}
			<div className={cn('absolute inset-6 sm:inset-8 border pointer-events-none', innerFrameTone)} />

			{/* BIG INITIAL — single hero element, anchored bottom-right with character */}
			<span
				aria-hidden
				className={cn(
					'absolute font-display italic font-semibold select-none leading-none',
					tone === 'paper' ? 'opacity-[0.32]' : 'opacity-[0.24]',
				)}
				style={{
					fontSize: 'clamp(340px, 46vw, 680px)',
					letterSpacing: '-0.08em',
					fontVariationSettings: '"opsz" 144',
					color: 'currentColor',
					right: '-8%',
					bottom: '-14%',
					transform: 'rotate(-3deg)',
				}}
			>
				{meta.initial}
			</span>

			{/* BOTTOM-LEFT — chapter caption (vertical rule + label + mono section) */}
			<div className='absolute bottom-8 sm:bottom-12 left-8 sm:left-12 flex items-stretch gap-4'>
				<span aria-hidden className={cn('block w-px self-stretch min-h-[64px]', ruleTone)} />
				<div className='flex flex-col gap-2 justify-end'>
					<span className='font-mono text-2xs uppercase tracking-[0.24em] opacity-55 tabular-nums'>
						Chapter · {meta.section}
					</span>
					<span
						className='font-display italic font-medium leading-[1.05]'
						style={{
							fontSize: 'clamp(20px, 1.8vw, 28px)',
							fontVariationSettings: '"opsz" 36',
						}}
					>
						{meta.label}.
					</span>
				</div>
			</div>

			{/* Scanline-ish noise overlay (last so it sits above the wash) */}
			<div
				aria-hidden
				className='absolute inset-0 pointer-events-none'
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)',
				}}
			/>
		</div>
	);
};

export const PinnedStory = ({
	persona,
	eyebrow,
	headline,
	body,
	imageSide,
	tone = 'dark',
	imageSrc,
}: PinnedStoryProps) => {
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;
			if (prefersReducedMotion()) return;
			const imageWrap = root.querySelector<HTMLElement>('[data-story-image]');
			const eyebrowEl = root.querySelector<HTMLElement>('[data-story-eyebrow]');
			const headlineEl = root.querySelector<HTMLElement>('[data-story-headline]');
			const bodyEl = root.querySelector<HTMLElement>('[data-story-body]');
			if (!imageWrap || !headlineEl || !bodyEl) return;

			// Section-progress driven subtle scale + eyebrow fade-out.
			const trigger = ScrollTrigger.create({
				trigger: root,
				start: 'top top',
				end: 'bottom top',
				scrub: 1.2,
				onUpdate: (self) => {
					const p = self.progress;
					gsap.set(imageWrap, { scale: 1 + p * 0.04 });
					if (eyebrowEl) gsap.set(eyebrowEl, { opacity: 1 - p * 0.7, y: -p * 12 });
				},
			});
			return () => trigger.kill();
		},
		{ scope: rootRef },
	);

	const textCols = imageSide === 'left' ? 'lg:col-start-7 lg:col-span-6' : 'lg:col-start-1 lg:col-span-6';
	const imageCols = imageSide === 'left' ? 'lg:col-start-1 lg:col-span-5' : 'lg:col-start-8 lg:col-span-5';
	const sectionTone =
		tone === 'paper' ? 'bg-bg-paper text-bg-base' : 'bg-bg-base text-ink-primary';
	const eyebrowTone = tone === 'paper' ? 'text-clay-500' : 'text-clay-400';
	const headlineTone = tone === 'paper' ? 'text-bg-base' : 'text-ink-primary';
	const bodyTone = tone === 'paper' ? 'text-bg-base/80' : 'text-ink-secondary';

	return (
		<section
			ref={rootRef}
			className={cn('relative isolate overflow-hidden', sectionTone)}
			data-persona={persona}
		>
			<div className='min-h-[100svh] grid items-center px-4 sm:px-6 lg:px-8 py-24 lg:py-32'>
				<div className='mx-auto max-w-container w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center'>
					{/* Image */}
					<div
						data-story-image
						className={cn(
							'relative w-full will-change-transform',
							'aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]',
							'rounded-card overflow-hidden',
							imageCols,
							imageSide === 'right' && 'order-1 lg:order-none',
						)}
					>
						{imageSrc ? (
							<ImageClipReveal src={imageSrc} direction='up' duration={1.0} wrapperClassName='h-full' />
						) : (
							<PlaceholderArt persona={persona} tone={tone} />
						)}
					</div>

					{/* Text */}
					<div className={cn('flex flex-col gap-6', textCols)}>
						<span
							data-story-eyebrow
							className={cn('font-mono text-2xs uppercase tracking-[0.22em]', eyebrowTone)}
						>
							{eyebrow}
						</span>
						<h2
							data-story-headline
							className={cn('font-display font-semibold tracking-[-0.04em] leading-[0.95]', headlineTone)}
							style={{
								fontSize: 'clamp(40px, 5.5vw, 84px)',
								fontVariationSettings: '"opsz" 144',
							}}
						>
							{headline}
						</h2>
						<p
							data-story-body
							className={cn('font-body leading-[1.55] max-w-xl', bodyTone)}
							style={{ fontSize: 'clamp(16px, 1.5vw, 20px)' }}
						>
							{body}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};
