import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface AuthPromptContent {
	/** Short label above the title, e.g. "Members only". */
	eyebrow?: string;
	title: string;
	message: string;
}

interface AuthPromptDialogProps {
	open: boolean;
	content: AuthPromptContent | null;
	onSignIn: () => void;
	onSignUp: () => void;
	onClose: () => void;
}

/**
 * Explains why an action needs an account and offers both paths — sign in or
 * create an account — without forcing either. Same DNA as ConfirmDialog:
 * ESC, backdrop click, the close button and "Not now" all dismiss; focus lands
 * on "Sign in" and returns to the trigger on close; body scroll is locked.
 */
export const AuthPromptDialog = ({ open, content, onSignIn, onSignUp, onClose }: AuthPromptDialogProps) => {
	const primaryRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const previouslyFocused = document.activeElement as HTMLElement | null;
		requestAnimationFrame(() => primaryRef.current?.focus());

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);

		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prevOverflow;
			previouslyFocused?.focus();
		};
	}, [open, onClose]);

	if (!open || !content) return null;

	return createPortal(
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='auth-prompt-title'
			aria-describedby='auth-prompt-message'
			className='fixed inset-0 z-[60] grid place-items-center p-4'
		>
			<button
				type='button'
				aria-label='Close'
				tabIndex={-1}
				onClick={onClose}
				className='absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default'
			/>
			<div
				className='relative w-full max-w-md rounded-card border border-line-base bg-bg-raised shadow-warm-3 p-6 sm:p-7'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type='button'
					aria-label='Close'
					onClick={onClose}
					className='absolute right-4 top-4 inline-grid place-items-center h-8 w-8 rounded-full text-ink-tertiary hover:text-ink-primary hover:bg-bg-overlay transition-colors'
				>
					<X size={16} strokeWidth={2} />
				</button>

				<header className='mb-3 pr-8'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						{content.eyebrow ?? 'Account needed'}
					</span>
					<h2
						id='auth-prompt-title'
						className='mt-2 font-display font-semibold text-xl sm:text-2xl text-ink-primary tracking-[-0.02em]'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						{content.title}
					</h2>
				</header>
				<p id='auth-prompt-message' className='font-body text-sm text-ink-secondary leading-[1.55]'>
					{content.message}
				</p>
				<p className='mt-3 font-body text-sm text-ink-tertiary leading-[1.55]'>
					You&apos;ll come straight back here afterwards.
				</p>

				<div className='mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2'>
					<button
						type='button'
						onClick={onClose}
						className='inline-flex items-center justify-center h-10 px-4 rounded-pill text-ink-tertiary hover:text-ink-primary font-body text-sm transition-colors'
					>
						Not now
					</button>
					<button
						type='button'
						onClick={onSignUp}
						className='inline-flex items-center justify-center h-10 px-4 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body text-sm transition-colors'
					>
						Create an account
					</button>
					<button
						ref={primaryRef}
						type='button'
						onClick={onSignIn}
						className='inline-flex items-center justify-center h-10 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-white font-body font-medium text-sm transition-colors'
					>
						Sign in
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
};
