import { useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, CircleCheck } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { BUILDER_STEPS, type StepKey } from './types';
import type { SaveStatus } from './useBuilderState';
import { cn } from '../../lib/cn';

interface BuilderShellProps {
	currentStep: StepKey;
	onChangeStep: (step: StepKey) => void;
	saveStatus: SaveStatus;
	onPublish?: () => void;
	canPublish?: boolean;
	publishLabel?: string;
	children: ReactNode;
}

const SAVE_LABELS: Record<SaveStatus, string> = {
	idle: 'Ready',
	unsaved: 'Unsaved changes',
	saving: 'Saving…',
	saved: 'All changes saved',
	error: 'Save failed',
};

export const BuilderShell = ({
	currentStep,
	onChangeStep,
	saveStatus,
	onPublish,
	canPublish = false,
	publishLabel,
	children,
}: BuilderShellProps) => {
	const navigate = useNavigate();
	const stageRef = useRef<HTMLDivElement>(null);
	const stepIndex = BUILDER_STEPS.findIndex((s) => s.key === currentStep);
	const step = BUILDER_STEPS[stepIndex];
	const prevStep = stepIndex > 0 ? BUILDER_STEPS[stepIndex - 1] : null;
	const nextStep = stepIndex < BUILDER_STEPS.length - 1 ? BUILDER_STEPS[stepIndex + 1] : null;

	useGSAP(
		() => {
			if (!stageRef.current) return;
			if (prefersReducedMotion()) return;
			gsap.fromTo(
				stageRef.current,
				{ opacity: 0, x: 24 },
				{ opacity: 1, x: 0, duration: 0.36, ease: 'power3.out' },
			);
		},
		{ scope: stageRef, dependencies: [currentStep] },
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
			if (e.key === 'ArrowRight' && nextStep) onChangeStep(nextStep.key);
			else if (e.key === 'ArrowLeft' && prevStep) onChangeStep(prevStep.key);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [nextStep, prevStep, onChangeStep]);

	return (
		<div className='min-h-screen bg-bg-base'>
			{/* Top bar */}
			<header className='sticky top-0 z-30 border-b border-line-subtle bg-bg-base/85 backdrop-blur-md'>
				<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4'>
					<div className='flex items-center gap-3'>
						<button
							type='button'
							onClick={() => navigate(-1)}
							aria-label='Back'
							className='inline-grid place-items-center h-8 w-8 rounded-md text-ink-tertiary hover:text-ink-primary transition-colors'
						>
							<ArrowLeft size={16} strokeWidth={2} />
						</button>
						<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
							Course Builder
						</span>
						<span aria-hidden className='text-ink-muted'>·</span>
						<span className='font-display font-medium text-sm text-ink-primary'>
							{step?.label ?? 'New course'}
						</span>
					</div>

					<div className='flex items-center gap-3'>
						<span
							className={cn(
								'inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.14em]',
								saveStatus === 'saved' && 'text-signal-success',
								saveStatus === 'saving' && 'text-ink-tertiary',
								saveStatus === 'unsaved' && 'text-sienna-400',
								saveStatus === 'error' && 'text-signal-danger',
								saveStatus === 'idle' && 'text-ink-tertiary',
							)}
						>
							{saveStatus === 'saved' && <CircleCheck size={11} strokeWidth={2} />}
							{SAVE_LABELS[saveStatus]}
						</span>
						{onPublish && (
							<button
								type='button'
								onClick={onPublish}
								disabled={!canPublish}
								className='inline-flex items-center h-9 px-4 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
							>
								{publishLabel ?? 'Publish'}
							</button>
						)}
					</div>
				</div>

				{/* Progress strip */}
				<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 pb-4'>
					<ol className='flex items-center gap-1 sm:gap-2'>
						{BUILDER_STEPS.map((s, idx) => {
							const isCurrent = s.key === currentStep;
							const isPast = idx < stepIndex;
							return (
								<li key={s.key} className='flex-1 min-w-0'>
									<button
										type='button'
										onClick={() => onChangeStep(s.key)}
										className='w-full text-left'
									>
										<div
											className={cn(
												'h-1 rounded-pill transition-colors duration-base',
												isCurrent ? 'bg-clay-500' : isPast ? 'bg-clay-500/50' : 'bg-line-base',
											)}
										/>
										<div className='mt-2 hidden sm:flex items-baseline gap-2'>
											<span
												className={cn(
													'font-mono text-2xs tabular-nums',
													isCurrent || isPast ? 'text-clay-400' : 'text-ink-muted',
												)}
											>
												{s.number}
											</span>
											<span
												className={cn(
													'font-body text-xs truncate',
													isCurrent
														? 'text-ink-primary'
														: isPast
															? 'text-ink-secondary'
															: 'text-ink-tertiary',
												)}
											>
												{s.label}
											</span>
										</div>
									</button>
								</li>
							);
						})}
					</ol>
				</div>
			</header>

			{/* Stage */}
			<main className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
				<div className='mb-10'>
					<span
						className='font-display italic font-medium text-ink-tertiary'
						style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontVariationSettings: '"opsz" 144' }}
					>
						{step?.number}
					</span>
					<h1
						className='mt-2 font-display font-semibold text-4xl sm:text-5xl text-ink-primary tracking-[-0.03em] leading-[0.95]'
						style={{ fontVariationSettings: '"opsz" 96' }}
					>
						{step?.label}
					</h1>
					<p className='mt-3 font-body text-base text-ink-secondary'>{step?.description}</p>
				</div>

				<div ref={stageRef} className='will-change-transform'>
					{children}
				</div>

				{/* Footer nav */}
				<div className='mt-16 pt-8 border-t border-line-subtle flex items-center justify-between'>
					{prevStep ? (
						<button
							type='button'
							onClick={() => onChangeStep(prevStep.key)}
							className='inline-flex items-center gap-2 h-11 px-5 rounded-pill border border-line-base hover:border-line-strong text-ink-secondary hover:text-ink-primary font-body text-sm transition-colors'
						>
							<ArrowLeft size={14} strokeWidth={2} />
							{prevStep.label}
						</button>
					) : (
						<span />
					)}

					{nextStep ? (
						<button
							type='button'
							onClick={() => onChangeStep(nextStep.key)}
							className='inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							{nextStep.label}
							<ArrowRight size={14} strokeWidth={2} />
						</button>
					) : (
						onPublish && (
							<button
								type='button'
								onClick={onPublish}
								disabled={!canPublish}
								className='inline-flex items-center gap-2 h-11 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
							>
								{publishLabel ?? 'Publish course'}
								<ArrowRight size={14} strokeWidth={2} />
							</button>
						)
					)}
				</div>
			</main>
		</div>
	);
};
