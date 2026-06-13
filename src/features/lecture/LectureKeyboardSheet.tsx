import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';
import { gsap } from '../../lib/motion';
import { Surface, IconButton, Text } from '../../ui';

interface Shortcut {
	keys: string[];
	description: string;
}

const shortcuts: ReadonlyArray<Shortcut> = [
	{ keys: ['F'], description: 'Toggle focus mode' },
	{ keys: ['?'], description: 'Show this shortcuts panel' },
	{ keys: ['Esc'], description: 'Close any open panel / exit focus' },
	{ keys: ['Space'], description: 'Play / pause video' },
	{ keys: ['→'], description: 'Skip forward 10s' },
	{ keys: ['←'], description: 'Rewind 10s' },
];

export function LectureKeyboardSheet() {
	const [open, setOpen] = useState<boolean>(false);
	const [render, setRender] = useState<boolean>(false);
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
			if (e.key === '?' || (e.shiftKey && e.key === '/')) {
				e.preventDefault();
				setOpen(true);
			}
			if (e.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	useEffect(() => {
		if (open) setRender(true);
	}, [open]);

	useGSAP(
		() => {
			if (!render) return;
			const root = rootRef.current;
			if (!root) return;
			const backdrop = root.querySelector<HTMLElement>('[data-sheet-backdrop]');
			const panel = root.querySelector<HTMLElement>('[data-sheet-panel]');
			if (!backdrop || !panel) return;
			if (open) {
				gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.16 });
				gsap.fromTo(
					panel,
					{ y: 16, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.32, ease: 'power3.out' },
				);
			} else {
				gsap.to(backdrop, { opacity: 0, duration: 0.16 });
				gsap.to(panel, {
					y: 12,
					opacity: 0,
					duration: 0.2,
					ease: 'power2.in',
					onComplete: () => setRender(false),
				});
			}
		},
		{ scope: rootRef, dependencies: [open, render] },
	);

	if (!render) return null;

	return (
		<div
			ref={rootRef}
			className='fixed inset-0 z-50 grid place-items-center p-4'
			role='dialog'
			aria-modal='true'
			aria-label='Keyboard shortcuts'
		>
			<div
				data-sheet-backdrop
				onClick={() => setOpen(false)}
				className='absolute inset-0 bg-black/70 backdrop-blur-sm'
			/>
			<div data-sheet-panel className='relative w-full max-w-md'>
				<Surface level='overlay' className='shadow-elev-3 p-6'>
					<div className='flex items-center justify-between mb-4'>
						<Text as='h2' variant='display-sm' tone='primary'>
							Keyboard shortcuts
						</Text>
						<IconButton
							aria-label='Close shortcuts'
							size='sm'
							variant='ghost'
							onClick={() => setOpen(false)}
						>
							<X size={16} />
						</IconButton>
					</div>
					<ul className='flex flex-col gap-2'>
						{shortcuts.map((s) => (
							<li
								key={s.description}
								className='flex items-center justify-between py-2 border-b border-line-subtle last:border-none'
							>
								<Text variant='body-sm' tone='secondary'>
									{s.description}
								</Text>
								<div className='flex items-center gap-1'>
									{s.keys.map((k) => (
										<kbd
											key={k}
											className='inline-flex h-7 min-w-[28px] items-center justify-center px-1.5 rounded-md bg-bg-raised border border-line-base font-mono text-xs text-ink-secondary'
										>
											{k}
										</kbd>
									))}
								</div>
							</li>
						))}
					</ul>
				</Surface>
			</div>
		</div>
	);
}
