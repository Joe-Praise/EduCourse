import { useEffect, useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface MarqueeProps {
	speed?: number;
	reverse?: boolean;
	pauseOnHover?: boolean;
	className?: string;
	children: ReactNode;
}

/**
 * Infinite horizontal marquee. Duplicates children into two tracks and animates
 * the wrapper via xPercent loop. Speed is approximate px/sec (calculated against
 * the track width at mount + on resize).
 */
export const Marquee = ({
	speed = 50,
	reverse = false,
	pauseOnHover = true,
	className,
	children,
}: MarqueeProps) => {
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const tweenRef = useRef<gsap.core.Tween | null>(null);

	useGSAP(
		() => {
			const track = trackRef.current;
			if (!track) return;
			const trackWidth = track.scrollWidth / 2;
			const duration = trackWidth / speed;

			tweenRef.current?.kill();
			tweenRef.current = gsap.to(track, {
				x: reverse ? trackWidth : -trackWidth,
				duration,
				ease: 'none',
				repeat: -1,
				modifiers: {
					x: (x) => {
						const value = parseFloat(x);
						return `${(value % trackWidth) - (reverse ? trackWidth : 0)}px`;
					},
				},
			});
		},
		{ scope: wrapperRef, dependencies: [speed, reverse] },
	);

	useEffect(() => {
		const onResize = () => {
			const track = trackRef.current;
			if (!track) return;
			const trackWidth = track.scrollWidth / 2;
			const duration = trackWidth / speed;
			tweenRef.current?.kill();
			tweenRef.current = gsap.to(track, {
				x: reverse ? trackWidth : -trackWidth,
				duration,
				ease: 'none',
				repeat: -1,
				modifiers: {
					x: (x) => {
						const value = parseFloat(x);
						return `${(value % trackWidth) - (reverse ? trackWidth : 0)}px`;
					},
				},
			});
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [speed, reverse]);

	return (
		<div
			ref={wrapperRef}
			className={cn(
				'relative overflow-hidden',
				'[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
				pauseOnHover && '[&:hover>div]:[animation-play-state:paused]',
				className,
			)}
			onMouseEnter={() => pauseOnHover && tweenRef.current?.pause()}
			onMouseLeave={() => pauseOnHover && tweenRef.current?.resume()}
		>
			<div ref={trackRef} className='inline-flex shrink-0 will-change-transform whitespace-nowrap'>
				<div className='inline-flex shrink-0'>{children}</div>
				<div aria-hidden className='inline-flex shrink-0'>
					{children}
				</div>
			</div>
		</div>
	);
};
