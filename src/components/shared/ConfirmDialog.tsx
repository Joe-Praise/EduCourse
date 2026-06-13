import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	message?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	/** Use `danger` for destructive confirmations (delete, unenroll, etc). */
	tone?: 'default' | 'danger';
	onConfirm: () => void;
	onCancel: () => void;
}

/**
 * Editorial confirm dialog — small, focused, keyboard-aware.
 * - ESC closes (cancels).
 * - Backdrop click cancels.
 * - On open, focus moves to the confirm button so [Enter] confirms by default.
 * - Body scroll is locked while open.
 */
export const ConfirmDialog = ({
	open,
	title,
	message,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	tone = 'default',
	onConfirm,
	onCancel,
}: ConfirmDialogProps) => {
	const confirmRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const previouslyFocused = document.activeElement as HTMLElement | null;
		// defer to next frame so the element is mounted
		requestAnimationFrame(() => confirmRef.current?.focus());

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onCancel();
		};
		window.addEventListener('keydown', onKey);

		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prevOverflow;
			previouslyFocused?.focus();
		};
	}, [open, onCancel]);

	if (!open) return null;

	return createPortal(
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='confirm-dialog-title'
			className='fixed inset-0 z-[60] grid place-items-center p-4'
		>
			<button
				type='button'
				aria-label='Cancel'
				onClick={onCancel}
				className='absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default'
			/>
			<div
				className='relative w-full max-w-md rounded-card border border-line-base bg-bg-raised shadow-warm-3 p-6 sm:p-7'
				onClick={(e) => e.stopPropagation()}
			>
				<header className='mb-3'>
					<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
						{tone === 'danger' ? 'Confirm · destructive' : 'Confirm'}
					</span>
					<h2
						id='confirm-dialog-title'
						className='mt-2 font-display font-semibold text-xl sm:text-2xl text-ink-primary tracking-[-0.02em]'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						{title}
					</h2>
				</header>
				{message && (
					<p className='font-body text-sm text-ink-secondary leading-[1.55] mb-6'>
						{message}
					</p>
				)}
				<div className='flex items-center justify-end gap-2'>
					<button
						type='button'
						onClick={onCancel}
						className='inline-flex items-center h-10 px-4 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body text-sm transition-colors'
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type='button'
						onClick={onConfirm}
						className={cn(
							'inline-flex items-center h-10 px-5 rounded-pill text-white font-body font-medium text-sm transition-colors',
							tone === 'danger'
								? 'bg-signal-danger hover:opacity-90'
								: 'bg-clay-500 hover:bg-clay-600',
						)}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
};
