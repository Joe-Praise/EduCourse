import { useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface EarningsPoint {
	month: string;
	total: number;
}

interface EarningsCanvasProps {
	data: ReadonlyArray<EarningsPoint>;
	className?: string;
}

const W = 1000;
const H = 280;
const PAD = { top: 20, right: 12, bottom: 32, left: 12 };

const formatCurrency = (n: number): string => {
	if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
	if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
	return `$${n.toFixed(0)}`;
};

interface HoverInfo {
	x: number;
	y: number;
	point: EarningsPoint;
}

export const EarningsCanvas = ({ data, className }: EarningsCanvasProps) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const [hover, setHover] = useState<HoverInfo | null>(null);

	const { linePath, areaPath, points, maxValue } = useMemo(() => {
		const safe = data.length > 0 ? data : [{ month: '', total: 0 }];
		const max = Math.max(...safe.map((d) => d.total), 1);
		const innerW = W - PAD.left - PAD.right;
		const innerH = H - PAD.top - PAD.bottom;
		const step = safe.length > 1 ? innerW / (safe.length - 1) : 0;
		const pts = safe.map((d, i) => ({
			x: PAD.left + step * i,
			y: PAD.top + (innerH - (d.total / max) * innerH),
			point: d,
		}));
		const line = pts
			.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
			.join(' ');
		const lastX = pts[pts.length - 1]?.x ?? PAD.left;
		const firstX = pts[0]?.x ?? PAD.left;
		const baseY = PAD.top + innerH;
		const area = `${line} L${lastX.toFixed(1)},${baseY.toFixed(1)} L${firstX.toFixed(1)},${baseY.toFixed(1)} Z`;
		return { linePath: line, areaPath: area, points: pts, maxValue: max };
	}, [data]);

	useGSAP(
		() => {
			const root = rootRef.current;
			if (!root) return;
			if (prefersReducedMotion()) {
				gsap.set('[data-earnings-line]', { strokeDashoffset: 0 });
				gsap.set('[data-earnings-area]', { opacity: 1 });
				return;
			}
			const trigger = ScrollTrigger.create({
				trigger: root,
				start: 'top 75%',
				once: true,
				onEnter: () => {
					gsap.fromTo(
						'[data-earnings-line]',
						{ strokeDashoffset: 3000 },
						{ strokeDashoffset: 0, duration: 1.6, ease: 'power3.out' },
					);
					gsap.fromTo(
						'[data-earnings-area]',
						{ opacity: 0 },
						{ opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 },
					);
				},
			});
			return () => trigger.kill();
		},
		{ scope: rootRef, dependencies: [linePath] },
	);

	const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
		if (points.length === 0) return;
		const svg = svgRef.current;
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		const xRel = ((e.clientX - rect.left) / rect.width) * W;
		let closest = points[0];
		let minDist = Math.abs(xRel - closest.x);
		for (const p of points) {
			const d = Math.abs(xRel - p.x);
			if (d < minDist) {
				minDist = d;
				closest = p;
			}
		}
		setHover({ x: (closest.x / W) * rect.width, y: (closest.y / H) * rect.height, point: closest.point });
	};

	const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
		y: PAD.top + (1 - t) * (H - PAD.top - PAD.bottom),
		value: maxValue * t,
	}));

	return (
		<div ref={rootRef} className={cn('relative rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8', className)}>
			<header className='mb-6 flex items-end justify-between'>
				<div>
					<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
						Earnings
					</span>
					<h3
						className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
						style={{ fontVariationSettings: '"opsz" 32' }}
					>
						Last 6 months
					</h3>
				</div>
			</header>

			<div className='relative'>
				<svg
					ref={svgRef}
					viewBox={`0 0 ${W} ${H}`}
					className='w-full h-auto overflow-visible'
					onMouseMove={handleMouseMove}
					onMouseLeave={() => setHover(null)}
				>
					<defs>
						<linearGradient id='earningsFill' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='0%' stopColor='#C8472E' stopOpacity='0.32' />
							<stop offset='100%' stopColor='#C8472E' stopOpacity='0' />
						</linearGradient>
					</defs>

					{/* Y ticks */}
					{ticks.map((t, i) => (
						<g key={i}>
							<text
								x={W - PAD.right}
								y={t.y - 4}
								textAnchor='end'
								className='fill-ink-tertiary font-mono'
								style={{ fontSize: 10, letterSpacing: '0.05em' }}
							>
								{formatCurrency(t.value)}
							</text>
						</g>
					))}

					{/* Area */}
					<path
						data-earnings-area
						d={areaPath}
						fill='url(#earningsFill)'
					/>
					{/* Line */}
					<path
						data-earnings-line
						d={linePath}
						fill='none'
						stroke='#C8472E'
						strokeWidth='2'
						strokeLinejoin='round'
						strokeLinecap='round'
						strokeDasharray='3000'
					/>

					{/* X labels */}
					{points.map((p, i) => (
						<text
							key={i}
							x={p.x}
							y={H - 8}
							textAnchor='middle'
							className='fill-ink-tertiary font-mono'
							style={{ fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}
						>
							{p.point.month.slice(5)}
						</text>
					))}

					{/* Hover scrub */}
					{hover && (
						<g>
							<line
								x1={(hover.x / (svgRef.current?.clientWidth ?? W)) * W}
								y1={PAD.top}
								x2={(hover.x / (svgRef.current?.clientWidth ?? W)) * W}
								y2={H - PAD.bottom}
								stroke='rgba(245,239,227,0.2)'
								strokeWidth={1}
								strokeDasharray='3 3'
							/>
						</g>
					)}
				</svg>

				{/* Hover tooltip */}
				{hover && (
					<div
						className='pointer-events-none absolute glass rounded-card px-3 py-2 shadow-warm-2'
						style={{
							left: `${hover.x}px`,
							top: `${hover.y}px`,
							transform: 'translate(-50%, calc(-100% - 12px))',
						}}
					>
						<p className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary'>
							{hover.point.month}
						</p>
						<p className='font-display font-semibold text-lg text-ink-primary tabular-nums'>
							{formatCurrency(hover.point.total)}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
