/**
 * Root bootstrap loader (auth validation, etc).
 * Full-screen editorial composition: oversized italic wordmark mark with a
 * persona-color radial wash, a drawing hairline rule, and a mono caption.
 */
const Loading = () => {
	return (
		<div
			role='status'
			aria-live='polite'
			aria-label='Loading'
			className='fixed inset-0 z-50 grid place-items-center bg-bg-base overflow-hidden'
		>
			{/* Soft warm radial wash */}
			<div
				aria-hidden
				className='absolute inset-0 pointer-events-none'
				style={{
					background:
						'radial-gradient(ellipse at center, rgba(200,71,46,0.10) 0%, transparent 60%)',
				}}
			/>

			<div className='relative flex flex-col items-center gap-7'>
				{/* Italic Fraunces mark — slow oscillating sway */}
				<span
					aria-hidden
					className='font-display italic font-semibold text-clay-400 leading-none select-none'
					style={{
						fontSize: 'clamp(72px, 9vw, 132px)',
						fontVariationSettings: '"opsz" 144',
						letterSpacing: '-0.03em',
						animation: 'editorial-mark-sway 3.6s cubic-bezier(0.45, 0, 0.55, 1) infinite',
						transformOrigin: 'center bottom',
					}}
				>
					&amp;
				</span>

				{/* Drawing hairline */}
				<span
					aria-hidden
					className='editorial-rule-draw block w-32 h-px bg-ink-secondary'
				/>

				{/* Mono caption */}
				<span className='font-mono text-2xs uppercase tracking-[0.32em] text-ink-tertiary'>
					Loading
				</span>
			</div>

			<style>{`
				@keyframes editorial-mark-sway {
					0%, 100% { transform: rotate(-4deg); opacity: 0.7; }
					50% { transform: rotate(4deg); opacity: 1; }
				}
			`}</style>
		</div>
	);
};

export default Loading;
