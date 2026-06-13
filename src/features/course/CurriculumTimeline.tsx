import { useState } from 'react';
import { Lock, Play, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Lesson {
	_id: string;
	title: string;
	duration?: string;
	freePreview?: boolean;
}

interface Module {
	_id: string;
	title: string;
	moduleIndex?: number;
	lessons?: ReadonlyArray<Lesson>;
}

interface CurriculumTimelineProps {
	modules?: ReadonlyArray<Module>;
}

export const CurriculumTimeline = ({ modules = [] }: CurriculumTimelineProps) => {
	const [openModuleId, setOpenModuleId] = useState<string | null>(modules[0]?._id ?? null);

	if (modules.length === 0) {
		return (
			<p className='font-body text-ink-tertiary'>The curriculum is being assembled.</p>
		);
	}

	return (
		<div className='relative'>
			{/* Vertical track */}
			<div
				aria-hidden
				className='absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-line-base'
			/>

			<ol className='space-y-12'>
				{modules.map((module, idx) => {
					const isOpen = module._id === openModuleId;
					const indexLabel = String((module.moduleIndex ?? idx) + 1).padStart(2, '0');
					const lessonCount = module.lessons?.length ?? 0;

					return (
						<li key={module._id} className='relative pl-12 sm:pl-16'>
							{/* Node */}
							<button
								type='button'
								onClick={() => setOpenModuleId(isOpen ? null : module._id)}
								className={cn(
									'absolute left-0 top-0 inline-grid place-items-center h-9 w-9 rounded-full',
									'border bg-bg-base font-mono text-2xs',
									'transition-[border-color,color,background-color] duration-base',
									isOpen
										? 'border-clay-500 text-clay-400 bg-clay-500/10'
										: 'border-line-base text-ink-tertiary hover:border-line-strong hover:text-ink-secondary',
								)}
								aria-expanded={isOpen}
								aria-controls={`module-${module._id}-lessons`}
							>
								{indexLabel}
							</button>

							{/* Module heading */}
							<button
								type='button'
								onClick={() => setOpenModuleId(isOpen ? null : module._id)}
								className='group flex items-baseline justify-between w-full text-left gap-4'
							>
								<div>
									<h3
										className='font-display font-semibold text-2xl sm:text-3xl text-ink-primary leading-[1.15] tracking-[-0.02em]'
										style={{ fontVariationSettings: '"opsz" 48' }}
									>
										{module.title}
									</h3>
									<p className='mt-1 font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
										{lessonCount} lesson{lessonCount === 1 ? '' : 's'}
									</p>
								</div>
								<ChevronDown
									size={18}
									strokeWidth={2}
									aria-hidden
									className={cn(
										'shrink-0 text-ink-tertiary group-hover:text-ink-secondary transition-transform duration-base',
										isOpen && 'rotate-180 text-clay-400',
									)}
								/>
							</button>

							{/* Lessons — animated open via grid-rows */}
							<div
								id={`module-${module._id}-lessons`}
								className={cn(
									'grid transition-[grid-template-rows] duration-slow ease-out-quart',
									isOpen ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr]',
								)}
							>
								<div className='overflow-hidden'>
									<ul className='divide-y divide-line-subtle border-y border-line-subtle'>
										{(module.lessons ?? []).map((lesson, lessonIdx) => (
											<li key={lesson._id ?? lessonIdx}>
												<div className='group/row relative flex items-center gap-4 py-3.5'>
													<span className='inline-grid place-items-center h-8 w-8 rounded-full bg-bg-overlay text-ink-tertiary group-hover/row:text-clay-400 transition-colors'>
														{lesson.freePreview ? (
															<Play size={12} strokeWidth={2} fill='currentColor' />
														) : (
															<Lock size={12} strokeWidth={2} />
														)}
													</span>
													<span className='flex-1 font-body text-base text-ink-primary group-hover/row:text-clay-400 transition-colors'>
														{lesson.title}
													</span>
													{lesson.duration && (
														<span className='font-mono text-xs text-ink-tertiary tabular-nums'>
															{lesson.duration}
														</span>
													)}
													{lesson.freePreview && (
														<span className='font-mono text-2xs uppercase tracking-[0.18em] text-clay-400'>
															Preview
														</span>
													)}
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
};
