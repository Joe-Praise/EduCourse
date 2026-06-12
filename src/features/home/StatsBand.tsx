import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/motion';

interface Stat {
	label: string;
	value: number;
	prefix?: string;
	suffix?: string;
	format?: 'number' | 'currency-abbr';
}

const FALLBACK_STATS: ReadonlyArray<Stat> = [
	{ label: 'Students learning', value: 47000, suffix: '+', format: 'number' },
	{ label: 'Paid to creators', value: 2.3, prefix: '$', suffix: 'M', format: 'number' },
	{ label: 'Hours of content', value: 12000, format: 'number' },
];

interface StatsBandProps {
	totalStudents?: number;
	totalPaidToCreators?: number;
	totalLessons?: number;
}

const formatValue = (value: number, format?: Stat['format']): string => {
	if (format === 'number') {
		if (value >= 1000) return Math.round(value).toLocaleString();
	}
	return value % 1 === 0 ? value.toString() : value.toFixed(1);
};

export const StatsBand = ({ totalStudents, totalPaidToCreators, totalLessons }: StatsBandProps) => {
	const rootRef = useRef<HTMLDivElement>(null);

	const STATS: ReadonlyArray<Stat> =
		totalStudents != null
			? [
					{ label: 'Students learning', value: totalStudents, suffix: '+', format: 'number' },
					{
						label: 'Paid to creators',
						value: totalPaidToCreators != null && totalPaidToCreators >= 1_000_000
							? totalPaidToCreators / 1_000_000
							: (totalPaidToCreators ?? 0),
						prefix: '$',
						suffix: totalPaidToCreators != null && totalPaidToCreators >= 1_000_000 ? 'M' : '',
						format: 'number',
					},
					{ label: 'Lessons of content', value: totalLessons ?? 0, format: 'number' },
				]
			: FALLBACK_STATS;

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;
			if (prefersReducedMotion()) return;

			const numbers = root.querySelectorAll<HTMLElement>('[data-stat-value]');
			const trigger = ScrollTrigger.create({
				trigger: root,
				start: 'top 75%',
				once: true,
				onEnter: () => {
					numbers.forEach((el) => {
						const target = parseFloat(el.dataset.statValue ?? '0');
						const format = el.dataset.statFormat as Stat['format'] | undefined;
						const counter = { v: 0 };
						gsap.to(counter, {
							v: target,
							duration: 2,
							ease: 'power3.out',
							onUpdate: () => {
								el.textContent = formatValue(counter.v, format);
							},
						});
					});
				},
			});
			return () => trigger.kill();
		},
		{ scope: rootRef },
	);

	return (
		<section
			ref={rootRef}
			className='relative isolate py-24 sm:py-32 bg-bg-paper text-bg-base overflow-hidden'
		>
			<div className='mx-auto max-w-container px-4 sm:px-6 lg:px-8'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-bg-base/60'>
					In numbers
				</span>
				<h2
					className='mt-4 font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-bg-base tracking-[-0.03em] leading-[1.05] max-w-3xl'
					style={{ fontVariationSettings: '"opsz" 144' }}
				>
					Real outcomes, not vanity metrics.
				</h2>

				<dl className='mt-16 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8'>
					{STATS.map((s) => (
						<div key={s.label}>
							<dt className='font-mono text-2xs uppercase tracking-[0.18em] text-bg-base/50'>
								{s.label}
							</dt>
							<dd
								className='mt-3 font-display font-semibold tabular-nums text-bg-base'
								style={{
									fontSize: 'clamp(48px, 6vw, 84px)',
									lineHeight: '1',
									letterSpacing: '-0.04em',
									fontVariationSettings: '"opsz" 144',
								}}
							>
								{s.prefix}
								<span
									data-stat-value={s.value}
									data-stat-format={s.format}
								>
									0
								</span>
								{s.suffix}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
};
