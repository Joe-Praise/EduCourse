/**
 * Compact inline loader. Three clay dots with a staggered, scale-and-opacity
 * pulse — refined easing, mono caps caption underneath. Sits in whatever
 * wrapper the caller provides (does NOT force its own height).
 */
const LoadingEffect = () => {
	return (
		<div
			role='status'
			aria-live='polite'
			aria-label='Loading'
			className='inline-flex flex-col items-center gap-3'
		>
			<div className='flex items-center gap-2'>
				<span className='editorial-pulse-dot bg-clay-500' style={{ animationDelay: '0s' }} />
				<span className='editorial-pulse-dot bg-clay-500' style={{ animationDelay: '0.18s' }} />
				<span className='editorial-pulse-dot bg-clay-500' style={{ animationDelay: '0.36s' }} />
			</div>
			<span className='font-mono text-2xs uppercase tracking-[0.28em] text-ink-tertiary'>
				Loading
			</span>
		</div>
	);
};

export default LoadingEffect;
