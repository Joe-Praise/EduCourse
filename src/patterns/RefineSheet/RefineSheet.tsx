import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { cn } from '../../lib/cn';
import { IconButton } from '../../ui';

interface RefineSheetProps {
	open: boolean;
	onClose: () => void;
	side?: 'left' | 'right';
	title?: string;
	children: ReactNode;
}

export function RefineSheet({ open, onClose, side = 'right', title = 'Refine', children }: RefineSheetProps) {
	const [shouldRender, setShouldRender] = useState<boolean>(open);
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (open) setShouldRender(true);
	}, [open]);

	useGSAP(
		() => {
			if (!shouldRender) return;
			const root = rootRef.current;
			if (!root) return;
			const panel = root.querySelector<HTMLElement>('[data-sheet-panel]');
			const backdrop = root.querySelector<HTMLElement>('[data-sheet-backdrop]');
			if (!panel || !backdrop) return;

			if (open) {
				gsap.set(panel, { xPercent: side === 'right' ? 100 : -100 });
				gsap.to(panel, { xPercent: 0, duration: 0.32, ease: 'power3.out' });
				gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2 });
			} else {
				gsap.to(panel, {
					xPercent: side === 'right' ? 100 : -100,
					duration: 0.24,
					ease: 'power2.in',
					onComplete: () => setShouldRender(false),
				});
				gsap.to(backdrop, { opacity: 0, duration: 0.2 });
			}
		},
		{ scope: rootRef, dependencies: [open, shouldRender, side] },
	);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	// Lock the page behind the sheet so only the panel scrolls.
	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	if (!shouldRender) return null;

	return (
		<div ref={rootRef} className='fixed inset-0 z-50' role='dialog' aria-modal='true' aria-label={title}>
			<div
				data-sheet-backdrop
				className='absolute inset-0 bg-black/60 backdrop-blur-sm'
				onClick={onClose}
			/>
			<aside
				data-sheet-panel
				data-lenis-prevent
				className={cn(
					'absolute top-0 h-full w-[min(360px,100%)] bg-bg-raised overflow-y-auto overscroll-contain shadow-elev-3',
					side === 'right' ? 'right-0 border-l border-line-base' : 'left-0 border-r border-line-base',
				)}
			>
				<div className='sticky top-0 z-10 flex items-center justify-between bg-bg-raised/95 backdrop-blur-md border-b border-line-subtle px-5 py-4'>
					<h2 className='font-display font-semibold text-lg text-ink-primary'>{title}</h2>
					<IconButton aria-label='Close filters' size='sm' variant='ghost' onClick={onClose}>
						<X size={16} />
					</IconButton>
				</div>
				<div className='px-5 py-4'>{children}</div>
			</aside>
		</div>
	);
}
