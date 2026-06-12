import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { X, NotebookPen } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface Note {
	id: string;
	content: string;
	createdAt: string;
}

const STORAGE_KEY = (lessonId: string) => `educourse:notes:${lessonId}`;

interface NotesDrawerProps {
	lessonId: string;
	/** Optional controlled-open state for parents driving the drawer from
	 *  a custom trigger (e.g. a mobile dock). When provided, the built-in
	 *  bottom-left desktop trigger button is still shown on lg+ but the
	 *  caller owns the source of truth. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const NotesDrawer = ({ lessonId, open: controlledOpen, onOpenChange }: NotesDrawerProps) => {
	const [internalOpen, setInternalOpen] = useState<boolean>(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = (next: boolean | ((prev: boolean) => boolean)) => {
		const value = typeof next === 'function' ? next(open) : next;
		if (!isControlled) setInternalOpen(value);
		onOpenChange?.(value);
	};

	// Guards against the GSAP onComplete -> setRender(false) firing after the
	// component has already unmounted (e.g. when the user navigates away mid-
	// animation). The downstream removeChild error in the React reconciler is
	// almost always triggered by setState-after-unmount + portal cleanup races.
	const mountedRef = useRef<boolean>(true);
	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);
	const [render, setRender] = useState<boolean>(false);
	const [notes, setNotes] = useState<Note[]>([]);
	const [draft, setDraft] = useState<string>('');
	const rootRef = useRef<HTMLDivElement>(null);
	const draftRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const raw = window.localStorage.getItem(STORAGE_KEY(lessonId));
		if (raw) {
			try {
				const parsed = JSON.parse(raw) as Note[];
				setNotes(parsed);
			} catch {
				setNotes([]);
			}
		} else {
			setNotes([]);
		}
	}, [lessonId]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
			if (e.key === 'n' || e.key === 'N') {
				e.preventDefault();
				setOpen((v) => !v);
			} else if (e.key === 'Escape' && open) {
				setOpen(false);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	useEffect(() => {
		if (open) setRender(true);
	}, [open]);

	useGSAP(
		() => {
			if (!render) return;
			const root = rootRef.current;
			if (!root) return;
			const panel = root.querySelector<HTMLElement>('[data-notes-panel]');
			if (!panel) return;
			if (prefersReducedMotion()) {
				gsap.set(panel, { y: 0 });
				return;
			}
			if (open) {
				gsap.fromTo(
					panel,
					{ yPercent: 110 },
					{ yPercent: 0, duration: 0.42, ease: 'power3.out' },
				);
			} else {
				gsap.to(panel, {
					yPercent: 110,
					duration: 0.28,
					ease: 'power2.in',
					onComplete: () => {
						if (mountedRef.current) setRender(false);
					},
				});
			}
		},
		{ scope: rootRef, dependencies: [open, render] },
	);

	const saveNotes = (next: Note[]) => {
		setNotes(next);
		window.localStorage.setItem(STORAGE_KEY(lessonId), JSON.stringify(next));
	};

	const addNote = () => {
		const trimmed = draft.trim();
		if (!trimmed) return;
		const note: Note = {
			id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			content: trimmed,
			createdAt: new Date().toISOString(),
		};
		saveNotes([note, ...notes]);
		setDraft('');
		draftRef.current?.focus();
	};

	const removeNote = (id: string) => {
		saveNotes(notes.filter((n) => n.id !== id));
	};

	return (
		<>
			{/* Trigger button — bottom-left, desktop only. Mobile callers
				 should render their own trigger and pass controlled-open. */}
			<button
				type='button'
				onClick={() => setOpen(true)}
				data-cursor='grow'
				className={cn(
					'fixed left-6 bottom-6 z-30 hidden lg:inline-flex',
					'items-center gap-2 h-11 px-4 rounded-pill',
					'glass border border-line-base hover:border-line-strong text-ink-secondary hover:text-ink-primary',
					'font-body text-sm transition-colors duration-base',
					render && 'opacity-0 pointer-events-none',
				)}
			>
				<NotebookPen size={14} strokeWidth={2} />
				<span>Notes</span>
				<kbd className='ml-1 inline-flex h-5 px-1.5 items-center rounded-md bg-bg-overlay border border-line-base font-mono text-2xs text-ink-tertiary'>
					N
				</kbd>
			</button>

			{render && (
				<div ref={rootRef} className='fixed inset-x-0 bottom-0 z-40' role='dialog' aria-label='Lesson notes'>
					<div
						data-notes-panel
						className='glass-strong border-t border-line-base h-[40vh] min-h-[320px] flex flex-col will-change-transform'
					>
						{/* Header */}
						<div className='flex items-center justify-between px-6 py-4 border-b border-line-subtle'>
							<div className='flex items-center gap-3'>
								<NotebookPen size={14} strokeWidth={2} className='text-clay-400' />
								<h2 className='font-display font-semibold text-lg text-ink-primary'>
									Notes
								</h2>
								<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
									{notes.length} entr{notes.length === 1 ? 'y' : 'ies'}
								</span>
							</div>
							<button
								type='button'
								onClick={() => setOpen(false)}
								aria-label='Close notes'
								className='inline-grid place-items-center h-9 w-9 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors'
							>
								<X size={14} strokeWidth={2} />
							</button>
						</div>

						{/* Draft input */}
						<div className='px-6 py-4 border-b border-line-subtle'>
							<textarea
								ref={draftRef}
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
										e.preventDefault();
										addNote();
									}
								}}
								placeholder='Capture a thought… (⌘↵ to save)'
								rows={2}
								className='w-full bg-transparent outline-none resize-none font-body text-sm text-ink-primary placeholder:text-ink-tertiary'
							/>
							{draft.trim().length > 0 && (
								<div className='mt-2 flex justify-end'>
									<button
										type='button'
										onClick={addNote}
										className='inline-flex items-center h-9 px-4 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-xs transition-colors'
									>
										Save note
									</button>
								</div>
							)}
						</div>

						{/* Notes list */}
						<div className='flex-1 overflow-y-auto px-6 py-4'>
							{notes.length === 0 ? (
								<p className='font-body text-sm text-ink-tertiary text-center pt-6'>
									Nothing yet. Capture an idea while you watch.
								</p>
							) : (
								<ul className='space-y-3'>
									{notes.map((note) => (
										<li
											key={note.id}
											className='group p-4 rounded-card bg-bg-raised border border-line-subtle hover:border-line-base transition-colors'
										>
											<div className='flex items-start justify-between gap-3'>
												<p className='flex-1 font-body text-sm text-ink-primary leading-[1.55] whitespace-pre-wrap'>
													{note.content}
												</p>
												<button
													type='button'
													onClick={() => removeNote(note.id)}
													aria-label='Remove note'
													className='shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-ink-tertiary hover:text-signal-danger'
												>
													<X size={12} strokeWidth={2} />
												</button>
											</div>
											<p className='mt-2 font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
												{new Date(note.createdAt).toLocaleString(undefined, {
													dateStyle: 'short',
													timeStyle: 'short',
												})}
											</p>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
