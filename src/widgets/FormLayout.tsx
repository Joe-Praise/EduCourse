import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { cn } from '../lib/cn';

interface FormLayoutProps {
	children: ReactNode;
	/** Place the photo on the 'left' or 'right' half. */
	imageSide: 'left' | 'right';
	imageSrc: string;
	/** Editorial caption rendered over the photo (top-right). */
	caption?: string;
}

const FormLayout = ({ children, imageSide, imageSrc, caption }: FormLayoutProps) => {
	const photoRef = useRef<HTMLImageElement | null>(null);
	const photoWrapRef = useRef<HTMLDivElement | null>(null);

	useGSAP(
		() => {
			const img = photoRef.current;
			if (!img) return;
			if (prefersReducedMotion()) return;
			// Subtle idle drift — adds life when no cursor is hovering.
			gsap.to(img, {
				scale: 1.08,
				duration: 16,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1,
			});
		},
		{ scope: photoWrapRef },
	);

	useEffect(() => {
		if (prefersReducedMotion()) return;
		if (typeof window === 'undefined') return;
		if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
		const wrap = photoWrapRef.current;
		const img = photoRef.current;
		if (!wrap || !img) return;

		const onMove = (e: MouseEvent) => {
			const rect = wrap.getBoundingClientRect();
			const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
			gsap.to(img, {
				x: dx * 14,
				y: dy * 14,
				duration: 1.2,
				ease: 'power3.out',
				overwrite: 'auto',
			});
		};
		const onLeave = () => {
			gsap.to(img, { x: 0, y: 0, duration: 1, ease: 'power3.out' });
		};
		wrap.addEventListener('mousemove', onMove);
		wrap.addEventListener('mouseleave', onLeave);
		return () => {
			wrap.removeEventListener('mousemove', onMove);
			wrap.removeEventListener('mouseleave', onLeave);
		};
	}, []);

	return (
		<main className='min-h-svh bg-bg-base relative overflow-hidden'>
			{/* Ambient warm light */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0 -z-10'
				style={{
					background:
						'radial-gradient(ellipse at 75% 15%, rgba(200,71,46,0.10) 0%, transparent 55%), radial-gradient(ellipse at 15% 90%, rgba(184,153,104,0.06) 0%, transparent 60%)',
				}}
			/>

			<div className='min-h-svh grid md:grid-cols-12'>
				{/* Photo column */}
				<div
					ref={photoWrapRef}
					className={cn(
						'relative hidden md:block md:col-span-5 lg:col-span-6 overflow-hidden',
						imageSide === 'right' && 'md:order-2',
					)}
				>
					<img
						ref={photoRef}
						src={imageSrc}
						alt=''
						className='absolute inset-0 h-full w-full object-cover will-change-transform'
					/>
					{/* Vignette + warm wash */}
					<div
						aria-hidden
						className={cn(
							'absolute inset-0 bg-gradient-to-r',
							imageSide === 'left'
								? 'from-bg-base/20 via-transparent to-bg-base/40'
								: 'from-bg-base/40 via-transparent to-bg-base/20',
						)}
					/>
					<div
						aria-hidden
						className='absolute inset-0'
						style={{
							background:
								'linear-gradient(180deg, rgba(19,17,15,0.5) 0%, transparent 18%, transparent 75%, rgba(19,17,15,0.65) 100%)',
						}}
					/>

					{/* Brand wordmark — top-left */}
					<Link
						to='/'
						className='absolute top-8 left-8 inline-flex items-center gap-3 group'
						data-cursor='grow'
					>
						<span
							className='font-display italic font-semibold text-ink-primary leading-none transition-opacity group-hover:opacity-80'
							style={{ fontSize: 'clamp(28px, 2.5vw, 40px)', fontVariationSettings: '"opsz" 144', letterSpacing: '-0.03em' }}
						>
							EduCourse
						</span>
					</Link>

					{/* Editorial caption — top-right */}
					{caption && (
						<div className='absolute top-10 right-8 max-w-[18ch] text-right'>
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
								Now showing
							</span>
							<p
								className='mt-2 font-display italic font-medium text-ink-primary leading-[1.15]'
								style={{ fontSize: 'clamp(20px, 1.6vw, 28px)', fontVariationSettings: '"opsz" 96' }}
							>
								{caption}
							</p>
						</div>
					)}

					{/* Return home — bottom-left */}
					<Link
						to='/'
						className='absolute bottom-8 left-8 inline-flex items-center gap-2 font-body text-sm text-ink-secondary hover:text-ink-primary transition-colors'
					>
						<ArrowLeft size={14} strokeWidth={2} />
						Return home
					</Link>
				</div>

				{/* Form column */}
				<div
					className={cn(
						'relative flex items-center justify-center px-6 sm:px-10 lg:px-16 py-16',
						'col-span-12 md:col-span-7 lg:col-span-6',
						imageSide === 'right' && 'md:order-1',
					)}
				>
					<div className='w-full max-w-md'>{children}</div>
				</div>
			</div>
		</main>
	);
};

export default FormLayout;
