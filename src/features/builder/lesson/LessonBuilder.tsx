import { FC, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
	ArrowLeft,
	Bold as BoldIcon,
	Italic as ItalicIcon,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Code,
	Plus,
	X,
	Info,
	CheckCircle2,
	AlertTriangle,
	OctagonAlert,
	CircleCheck,
	Save,
	CloudOff,
} from 'lucide-react';
import { Callout } from './extensions/Callout';
import { TextField, TextAreaField } from '../steps/BuilderField';
import { getLessonApi, updateLessonApi, type LessonPayload } from '../../../redux/api/lessonApi';
import { cn } from '../../../lib/cn';

const STORAGE_KEY = (id: string) => `educourse:lesson-draft:${id}`;

interface LessonDraft {
	title: string;
	duration: string;
	videoUrl: string;
	freePreview: boolean;
	prerequisites: string;
	html: string;
}

const EMPTY_DRAFT: LessonDraft = {
	title: '',
	duration: '',
	videoUrl: '',
	freePreview: false,
	prerequisites: '',
	html: '',
};

type SaveStatus = 'local' | 'unsaved' | 'saving' | 'synced' | 'error';

const LessonBuilder: FC = () => {
	const { lessonId = 'new' } = useParams<{ lessonId?: string }>();
	const navigate = useNavigate();
	const isPersisted = lessonId !== 'new';

	const [draft, setDraft] = useState<LessonDraft>(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY(lessonId));
			if (raw) return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
		} catch {
			/* ignore */
		}
		return EMPTY_DRAFT;
	});
	const [status, setStatus] = useState<SaveStatus>(isPersisted ? 'synced' : 'local');
	const [hydrating, setHydrating] = useState<boolean>(isPersisted);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const localTimer = useRef<number | null>(null);
	const [showBlockMenu, setShowBlockMenu] = useState<boolean>(false);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: {
					HTMLAttributes: {
						class: 'rounded-card bg-bg-sunken px-4 py-3 font-mono text-sm text-ink-primary',
					},
				},
			}),
			LinkExt.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-clay-400 hover:text-clay-500 underline-offset-2 hover:underline',
					rel: 'noopener noreferrer',
					target: '_blank',
				},
			}),
			Placeholder.configure({ placeholder: 'Write the lesson…' }),
			Callout,
		],
		content: draft.html,
		onUpdate({ editor: ed }) {
			setDraft((d) => ({ ...d, html: ed.getHTML() }));
			setStatus((s) => (s === 'synced' ? 'unsaved' : s === 'local' ? 'local' : 'unsaved'));
		},
		editorProps: {
			attributes: {
				class:
					'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[60vh] font-body prose-headings:font-display prose-headings:text-ink-primary prose-headings:tracking-[-0.02em] prose-p:text-ink-secondary prose-p:leading-[1.7] prose-a:text-clay-400 hover:prose-a:text-clay-500 prose-blockquote:border-l-clay-500 prose-blockquote:font-display prose-blockquote:italic prose-blockquote:text-ink-primary prose-strong:text-ink-primary prose-code:text-clay-400 prose-code:before:content-none prose-code:after:content-none prose-code:bg-bg-overlay prose-code:rounded prose-code:px-1 prose-code:py-0.5',
			},
		},
	});

	// Hydrate from backend for persisted lessons.
	useEffect(() => {
		if (!isPersisted) return;
		let cancelled = false;
		(async () => {
			const res = await getLessonApi(lessonId);
			if (cancelled) return;
			if (res.error) {
				setErrorMessage(res.error);
				setStatus('error');
				setHydrating(false);
				return;
			}
			const remote = res.data;
			if (remote) {
				const next: LessonDraft = {
					title: remote.title ?? '',
					duration: remote.duration ?? '',
					videoUrl: remote.url ?? '',
					freePreview: false,
					prerequisites: '',
					html: remote.description ?? '',
				};
				setDraft(next);
				editor?.commands.setContent(next.html, { emitUpdate: false });
				setStatus('synced');
			}
			setHydrating(false);
		})();
		return () => {
			cancelled = true;
		};
	}, [isPersisted, lessonId, editor]);

	// Local autosave (always on — offline cache).
	useEffect(() => {
		if (localTimer.current) window.clearTimeout(localTimer.current);
		localTimer.current = window.setTimeout(() => {
			window.localStorage.setItem(STORAGE_KEY(lessonId), JSON.stringify(draft));
		}, 1500);
		return () => {
			if (localTimer.current) window.clearTimeout(localTimer.current);
		};
	}, [draft, lessonId]);

	if (!editor) return null;

	const updateField = <K extends keyof LessonDraft>(key: K, value: LessonDraft[K]) => {
		setDraft((d) => ({ ...d, [key]: value }));
		if (isPersisted) setStatus('unsaved');
	};

	const handleSaveToBackend = async () => {
		if (!isPersisted) return;
		if (!draft.title.trim()) {
			setErrorMessage('Lesson needs a title before saving.');
			setStatus('error');
			return;
		}
		if (!draft.videoUrl.trim()) {
			setErrorMessage('Lesson needs a video URL (the backend requires it).');
			setStatus('error');
			return;
		}
		setStatus('saving');
		setErrorMessage(null);
		const payload: Partial<LessonPayload> = {
			title: draft.title.trim(),
			url: draft.videoUrl.trim(),
			duration: draft.duration.trim() || '0:00',
			description: draft.html,
		};
		const res = await updateLessonApi(lessonId, payload);
		if (res.error) {
			setErrorMessage(res.error);
			setStatus('error');
			return;
		}
		setStatus('synced');
	};

	const blocks: Array<{ icon: typeof Info; label: string; description: string; onClick: () => void }> = [
		{ icon: Heading2, label: 'Heading 2', description: 'Section title', onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
		{ icon: Heading3, label: 'Heading 3', description: 'Subsection', onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
		{ icon: List, label: 'Bullet list', description: 'Unordered list', onClick: () => editor.chain().focus().toggleBulletList().run() },
		{ icon: ListOrdered, label: 'Numbered list', description: 'Ordered list', onClick: () => editor.chain().focus().toggleOrderedList().run() },
		{ icon: Quote, label: 'Quote', description: 'Pull quote', onClick: () => editor.chain().focus().toggleBlockquote().run() },
		{ icon: Code, label: 'Code block', description: 'Monospaced code', onClick: () => editor.chain().focus().toggleCodeBlock().run() },
		{ icon: Info, label: 'Callout · Info', description: 'Highlighted note', onClick: () => editor.chain().focus().setCallout('info').run() },
		{ icon: CheckCircle2, label: 'Callout · Success', description: 'Positive note', onClick: () => editor.chain().focus().setCallout('success').run() },
		{ icon: AlertTriangle, label: 'Callout · Warning', description: 'Cautionary note', onClick: () => editor.chain().focus().setCallout('warning').run() },
		{ icon: OctagonAlert, label: 'Callout · Danger', description: 'Critical note', onClick: () => editor.chain().focus().setCallout('danger').run() },
	];

	const statusBadge = () => {
		if (hydrating) return { label: 'Loading…', className: 'text-ink-tertiary', icon: null };
		switch (status) {
			case 'local':
				return { label: 'Local draft', className: 'text-ink-tertiary', icon: CloudOff };
			case 'unsaved':
				return { label: 'Unsaved changes', className: 'text-sienna-400', icon: null };
			case 'saving':
				return { label: 'Saving…', className: 'text-ink-tertiary', icon: null };
			case 'synced':
				return { label: 'Saved', className: 'text-signal-success', icon: CircleCheck };
			case 'error':
				return { label: 'Save failed', className: 'text-signal-danger', icon: AlertTriangle };
		}
	};
	const badge = statusBadge();
	const BadgeIcon = badge.icon;

	return (
		<div className='min-h-screen bg-bg-base'>
			{/* Top bar */}
			<header className='sticky top-0 z-30 border-b border-line-subtle bg-bg-base/85 backdrop-blur-md'>
				<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4'>
					<div className='flex items-center gap-3 min-w-0 flex-1'>
						<button
							type='button'
							onClick={() => navigate(-1)}
							aria-label='Back to course'
							className='inline-grid place-items-center h-9 w-9 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors'
						>
							<ArrowLeft size={14} strokeWidth={2} />
						</button>
						<input
							type='text'
							value={draft.title}
							onChange={(e) => updateField('title', e.target.value)}
							placeholder='Untitled lesson'
							className='flex-1 min-w-0 bg-transparent outline-none font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
							style={{ fontVariationSettings: '"opsz" 32' }}
						/>
					</div>
					<div className='flex items-center gap-3'>
						<span
							className={cn(
								'inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.14em]',
								badge.className,
							)}
						>
							{BadgeIcon && <BadgeIcon size={11} strokeWidth={2} />}
							{badge.label}
						</span>
						{isPersisted && (
							<button
								type='button'
								onClick={handleSaveToBackend}
								disabled={status === 'saving' || hydrating}
								className='inline-flex items-center gap-2 h-9 px-4 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
							>
								<Save size={12} strokeWidth={2} />
								Save lesson
							</button>
						)}
					</div>
				</div>

				{/* Toolbar */}
				<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 pb-3 flex items-center gap-1 overflow-x-auto'>
					<ToolbarBtn icon={BoldIcon} label='Bold' active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
					<ToolbarBtn icon={ItalicIcon} label='Italic' active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
					<ToolbarSep />
					<ToolbarBtn icon={Heading2} label='H2' active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
					<ToolbarBtn icon={Heading3} label='H3' active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
					<ToolbarSep />
					<ToolbarBtn icon={List} label='Bullets' active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
					<ToolbarBtn icon={ListOrdered} label='Numbered' active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
					<ToolbarSep />
					<ToolbarBtn icon={Quote} label='Quote' active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
					<ToolbarBtn icon={Code} label='Code' active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
				</div>
			</header>

			{/* Editor + sidebar */}
			<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12'>
					<div className='relative'>
						{!isPersisted && (
							<div className='mb-6 rounded-card border border-sienna-400/30 bg-sienna-500/5 p-4'>
								<p className='font-display font-medium text-sm text-ink-primary'>
									Local draft only
								</p>
								<p className='mt-1 font-body text-xs text-ink-tertiary'>
									This lesson hasn't been linked to a course yet. Open it from a published course's
									curriculum to sync with the backend.
								</p>
							</div>
						)}
						{errorMessage && status === 'error' && (
							<div role='alert' className='mb-6 rounded-card border border-signal-danger/40 bg-signal-danger/10 p-4'>
								<p className='font-body text-sm text-signal-danger'>{errorMessage}</p>
							</div>
						)}
						<EditorContent editor={editor} />
						<button
							type='button'
							onClick={() => setShowBlockMenu(true)}
							aria-label='Insert block'
							className='fixed left-4 sm:left-8 lg:left-[calc((100vw-1280px)/2+2rem-56px)] top-1/2 -translate-y-1/2 inline-grid place-items-center h-11 w-11 rounded-full bg-clay-500 hover:bg-clay-600 text-ink-primary shadow-clay transition-colors'
						>
							<Plus size={16} strokeWidth={2.5} />
						</button>
					</div>

					{/* Sidebar — metadata */}
					<aside className='space-y-6 lg:sticky lg:top-[140px] self-start'>
						<TextField
							label='Video URL'
							required={isPersisted}
							value={draft.videoUrl}
							onChange={(e) => updateField('videoUrl', e.target.value)}
							placeholder='https://… (required by backend)'
							hint='YouTube, Vimeo, or a hosted video URL.'
							type='url'
						/>
						<TextField
							label='Estimated duration'
							value={draft.duration}
							onChange={(e) => updateField('duration', e.target.value)}
							placeholder='12:00'
							hint='Approximate watch time.'
						/>
						<TextAreaField
							label='Prerequisites'
							rows={3}
							value={draft.prerequisites}
							onChange={(e) => updateField('prerequisites', e.target.value)}
							placeholder='What students should know before this lesson.'
							hint='Stored locally only (backend lesson model has no prerequisites field).'
						/>
						<label className='flex items-center justify-between gap-3 p-4 rounded-card bg-bg-raised border border-line-subtle cursor-pointer'>
							<div>
								<p className='font-display font-medium text-sm text-ink-primary'>Free preview</p>
								<p className='font-body text-xs text-ink-tertiary'>
									Local only — backend doesn't track this yet.
								</p>
							</div>
							<input
								type='checkbox'
								checked={draft.freePreview}
								onChange={(e) => updateField('freePreview', e.target.checked)}
								className='h-5 w-5 accent-clay-500'
							/>
						</label>

						<Link
							to='/instructor/dashboard'
							className='block text-center font-body text-xs text-ink-tertiary hover:text-ink-primary transition-colors'
						>
							← Back to dashboard
						</Link>
					</aside>
				</div>
			</div>

			{/* Block menu modal */}
			{showBlockMenu && (
				<div
					className='fixed inset-0 z-50 grid place-items-center p-4'
					role='dialog'
					aria-modal='true'
					aria-label='Insert block'
				>
					<div
						onClick={() => setShowBlockMenu(false)}
						className='absolute inset-0 bg-black/70 backdrop-blur-sm'
					/>
					<div className='relative w-full max-w-lg glass-strong rounded-card overflow-hidden shadow-warm-3'>
						<div className='flex items-center justify-between px-5 py-4 border-b border-line-subtle'>
							<h2 className='font-display font-semibold text-lg text-ink-primary'>Insert block</h2>
							<button
								type='button'
								onClick={() => setShowBlockMenu(false)}
								aria-label='Close'
								className='inline-grid place-items-center h-8 w-8 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors'
							>
								<X size={14} strokeWidth={2} />
							</button>
						</div>
						<ul className='max-h-[60vh] overflow-y-auto py-2'>
							{blocks.map((b) => {
								const Icon = b.icon;
								return (
									<li key={b.label}>
										<button
											type='button'
											onClick={() => {
												b.onClick();
												setShowBlockMenu(false);
											}}
											className='w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-bg-overlay/40 transition-colors'
										>
											<span className='inline-grid place-items-center h-9 w-9 rounded-card bg-bg-overlay text-ink-secondary shrink-0'>
												<Icon size={14} strokeWidth={1.75} />
											</span>
											<span className='flex-1'>
												<span className='block font-display font-medium text-sm text-ink-primary'>
													{b.label}
												</span>
												<span className='block font-body text-xs text-ink-tertiary'>
													{b.description}
												</span>
											</span>
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

interface ToolbarBtnProps {
	icon: typeof BoldIcon;
	label: string;
	active: boolean;
	onClick: () => void;
}

const ToolbarBtn = ({ icon: Icon, label, active, onClick }: ToolbarBtnProps) => (
	<button
		type='button'
		onClick={onClick}
		aria-label={label}
		title={label}
		className={cn(
			'inline-grid place-items-center h-9 w-9 rounded-card transition-colors',
			active ? 'bg-clay-500/15 text-clay-400' : 'text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40',
		)}
	>
		<Icon size={14} strokeWidth={2} />
	</button>
);

const ToolbarSep = () => <span aria-hidden className='inline-block h-5 w-px bg-line-subtle mx-1' />;

export default LessonBuilder;
