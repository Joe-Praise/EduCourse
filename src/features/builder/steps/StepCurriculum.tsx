import { Plus, X, BookOpen, Link, PencilLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SortableList } from '../SortableList';
import { type CourseDraft, type BuilderModule, type BuilderLesson } from '../types';
import { cn } from '../../../lib/cn';

interface StepCurriculumProps {
	draft: CourseDraft;
	update: <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => void;
	readOnly?: boolean;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const isBackendId = (id: string) => /^[0-9a-f]{24}$/i.test(id);

export const StepCurriculum = ({ draft, update, readOnly = false }: StepCurriculumProps) => {
	const navigate = useNavigate();
	const setModules = (modules: BuilderModule[]) => update('modules', modules);

	const addModule = () => {
		setModules([
			...draft.modules,
			{ id: newId(), title: `Module ${draft.modules.length + 1}`, lessons: [] },
		]);
	};

	const removeModule = (mid: string) => {
		setModules(draft.modules.filter((m) => m.id !== mid));
	};

	const updateModule = (mid: string, patch: Partial<BuilderModule>) => {
		setModules(draft.modules.map((m) => (m.id === mid ? { ...m, ...patch } : m)));
	};

	const addLesson = (mid: string) => {
		const m = draft.modules.find((x) => x.id === mid);
		if (!m) return;
		updateModule(mid, {
			lessons: [...m.lessons, { id: newId(), title: `Lesson ${m.lessons.length + 1}` }],
		});
	};

	const updateLesson = (mid: string, lid: string, patch: Partial<BuilderLesson>) => {
		const m = draft.modules.find((x) => x.id === mid);
		if (!m) return;
		updateModule(mid, {
			lessons: m.lessons.map((l) => (l.id === lid ? { ...l, ...patch } : l)),
		});
	};

	const removeLesson = (mid: string, lid: string) => {
		const m = draft.modules.find((x) => x.id === mid);
		if (!m) return;
		updateModule(mid, { lessons: m.lessons.filter((l) => l.id !== lid) });
	};

	const reorderLessons = (mid: string, next: BuilderLesson[]) => {
		const m = draft.modules.find((x) => x.id === mid);
		if (!m) return;
		updateModule(mid, { lessons: next });
	};

	// Read-only view for edit mode — changes to individual lessons go through LessonBuilder
	if (readOnly) {
		if (draft.modules.length === 0) {
			return (
				<div className='max-w-2xl py-16 grid place-items-center text-center'>
					<span className='inline-grid place-items-center h-16 w-16 rounded-full bg-bg-overlay text-ink-tertiary mx-auto'>
						<BookOpen size={20} strokeWidth={1.5} />
					</span>
					<p className='mt-4 font-body text-sm text-ink-tertiary'>No modules yet.</p>
				</div>
			);
		}
		return (
			<div className='space-y-4 max-w-3xl'>
				<p className='font-body text-xs text-ink-tertiary'>
					Curriculum is read-only here. Edit individual lessons via their Lesson Builder page.
				</p>
				{draft.modules.map((module, mIdx) => (
					<div key={module.id} className='rounded-card border border-line-subtle bg-bg-raised overflow-hidden'>
						<header className='flex items-center gap-2 px-4 py-3 border-b border-line-subtle'>
							<span className='shrink-0 inline-grid place-items-center h-8 w-8 rounded-full bg-bg-overlay font-mono text-2xs text-ink-tertiary tabular-nums'>
								{String(mIdx + 1).padStart(2, '0')}
							</span>
							<span className='flex-1 font-display font-semibold text-lg text-ink-primary tracking-[-0.02em]'>
								{module.title}
							</span>
						</header>
						{module.lessons.length > 0 && (
							<ul className='px-4 py-2 space-y-1'>
								{module.lessons.map((lesson, lIdx) => (
									<li key={lesson.id} className='flex items-center gap-2 py-1'>
										<span className='shrink-0 inline-grid place-items-center h-7 w-7 rounded-full bg-bg-overlay font-mono text-2xs text-ink-tertiary tabular-nums'>
											{lIdx + 1}
										</span>
										<span className='flex-1 font-body text-sm text-ink-primary truncate'>
											{lesson.title}
										</span>
										{lesson.duration && (
											<span className='font-mono text-xs text-ink-tertiary tabular-nums'>
												{lesson.duration}
											</span>
										)}
										<button
											type='button'
											onClick={() => navigate(`/instructor/lessons/${lesson.id}/edit`)}
											className='inline-flex items-center gap-1 px-2 py-1 rounded-md text-2xs font-body text-ink-secondary hover:text-clay-400 transition-colors'
										>
											<PencilLine size={10} strokeWidth={2} />
											Edit
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				))}
			</div>
		);
	}

	if (draft.modules.length === 0) {
		return (
			<div className='max-w-2xl py-16 grid place-items-center text-center'>
				<div>
					<span className='inline-grid place-items-center h-16 w-16 rounded-full bg-bg-overlay text-ink-tertiary mx-auto'>
						<BookOpen size={20} strokeWidth={1.5} />
					</span>
					<h3 className='mt-6 font-display font-semibold text-2xl text-ink-primary'>
						Build the spine of the course.
					</h3>
					<p className='mt-2 max-w-sm mx-auto font-body text-sm text-ink-tertiary'>
						Create the first module — usually a 1-line introduction.
					</p>
					<button
						type='button'
						onClick={addModule}
						className='mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
					>
						<Plus size={14} strokeWidth={2} />
						Add your first module
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6 max-w-3xl'>
			<p className='font-body text-xs text-ink-tertiary'>
				Drag the handle to reorder modules and lessons.
			</p>

			<SortableList items={draft.modules} getId={(m) => m.id} onReorder={setModules}>
				{(module, mIdx) => (
					<div className='rounded-card border border-line-subtle bg-bg-raised overflow-hidden'>
						<header className='flex items-center gap-2 px-4 py-3 border-b border-line-subtle'>
							<span className='shrink-0 inline-grid place-items-center h-8 w-8 rounded-full bg-bg-overlay font-mono text-2xs text-ink-tertiary tabular-nums'>
								{String(mIdx + 1).padStart(2, '0')}
							</span>
							<input
								type='text'
								value={module.title}
								onChange={(e) => updateModule(module.id, { title: e.target.value })}
								placeholder='Module title'
								className='flex-1 bg-transparent outline-none font-display font-semibold text-lg text-ink-primary tracking-[-0.02em]'
							/>
							<button
								type='button'
								onClick={() => removeModule(module.id)}
								aria-label='Remove module'
								className='inline-grid place-items-center h-9 w-8 text-ink-tertiary hover:text-signal-danger transition-colors'
							>
								<X size={14} strokeWidth={2} />
							</button>
						</header>

						{module.lessons.length > 0 && (
							<div className='px-4 py-2'>
								<SortableList
									items={module.lessons}
									getId={(l) => l.id}
									onReorder={(next) => reorderLessons(module.id, next)}
								>
									{(lesson, lIdx) => (
										<div className='py-1'>
											<div className='flex items-center gap-2'>
												<span className='shrink-0 inline-grid place-items-center h-7 w-7 rounded-full bg-bg-overlay font-mono text-2xs text-ink-tertiary tabular-nums'>
													{lIdx + 1}
												</span>
												<input
													type='text'
													value={lesson.title}
													onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
													placeholder='Lesson title'
													className='flex-1 bg-transparent outline-none font-body text-sm text-ink-primary'
												/>
												<input
													type='text'
													value={lesson.duration ?? ''}
													onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
													placeholder='12:00'
													className='w-20 bg-transparent outline-none text-right font-mono text-xs text-ink-tertiary tabular-nums'
												/>
												<label
													className={cn(
														'inline-flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-md text-2xs font-mono uppercase tracking-[0.14em] cursor-pointer transition-colors',
														lesson.freePreview
															? 'bg-clay-500/15 text-clay-400'
															: 'bg-bg-overlay text-ink-tertiary hover:text-ink-secondary',
													)}
												>
													<input
														type='checkbox'
														className='sr-only'
														checked={lesson.freePreview ?? false}
														onChange={(e) =>
															updateLesson(module.id, lesson.id, { freePreview: e.target.checked })
														}
													/>
													Preview
												</label>
												{isBackendId(lesson.id) && (
													<button
														type='button'
														onClick={() => navigate(`/instructor/lessons/${lesson.id}/edit`)}
														className='inline-flex items-center gap-1 px-2 py-1 rounded-md text-2xs font-body text-ink-secondary hover:text-clay-400 transition-colors'
													>
														<PencilLine size={10} strokeWidth={2} />
														Edit
													</button>
												)}
												<button
													type='button'
													onClick={() => removeLesson(module.id, lesson.id)}
													aria-label='Remove lesson'
													className='inline-grid place-items-center h-8 w-7 text-ink-tertiary hover:text-signal-danger transition-colors'
												>
													<X size={12} strokeWidth={2} />
												</button>
											</div>
											<div className='flex items-center gap-1.5 pl-9 mt-0.5'>
												<Link size={10} strokeWidth={2} className='shrink-0 text-ink-tertiary' />
												<input
													type='url'
													value={lesson.url ?? ''}
													onChange={(e) => updateLesson(module.id, lesson.id, { url: e.target.value })}
													placeholder='YouTube URL (optional — set now or via Lesson Builder)'
													className='flex-1 bg-transparent outline-none font-body text-xs text-ink-tertiary placeholder:text-ink-quaternary'
												/>
											</div>
										</div>
									)}
								</SortableList>
							</div>
						)}

						<div className='px-4 py-2 border-t border-line-subtle'>
							<button
								type='button'
								onClick={() => addLesson(module.id)}
								className='inline-flex items-center gap-2 font-body text-xs text-ink-secondary hover:text-clay-400 transition-colors'
							>
								<Plus size={12} strokeWidth={2} />
								Add lesson
							</button>
						</div>
					</div>
				)}
			</SortableList>

			<button
				type='button'
				onClick={addModule}
				className='inline-flex items-center gap-2 h-11 px-5 rounded-pill border border-dashed border-line-base hover:border-line-strong text-ink-secondary hover:text-ink-primary font-body text-sm transition-colors'
			>
				<Plus size={14} strokeWidth={2} />
				Add module
			</button>
		</div>
	);
};
