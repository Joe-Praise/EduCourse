import { useRef, type ImgHTMLAttributes } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface ImageClipRevealProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'ref'> {
	direction?: 'up' | 'down' | 'left' | 'right';
	duration?: number;
	start?: string;
	wrapperClassName?: string;
}

const initialClip: Record<NonNullable<ImageClipRevealProps['direction']>, string> = {
	up: 'inset(100% 0 0 0)',
	down: 'inset(0 0 100% 0)',
	left: 'inset(0 100% 0 0)',
	right: 'inset(0 0 0 100%)',
};

export const ImageClipReveal = ({
	direction = 'up',
	duration = 0.9,
	start = 'top 80%',
	wrapperClassName,
	className,
	alt = '',
	...imgProps
}: ImageClipRevealProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	useGSAP(
		() => {
			const img = imgRef.current;
			if (!img) return;
			if (prefersReducedMotion()) {
				gsap.set(img, { clipPath: 'inset(0)', scale: 1 });
				return;
			}
			gsap.set(img, { clipPath: initialClip[direction], scale: 1.08 });
			const trigger = ScrollTrigger.create({
				trigger: wrapperRef.current,
				start,
				once: true,
				onEnter: () =>
					gsap.to(img, {
						clipPath: 'inset(0% 0 0 0)',
						scale: 1,
						duration,
						ease: 'power3.out',
					}),
			});
			return () => trigger.kill();
		},
		{ scope: wrapperRef, dependencies: [direction, duration, start] },
	);

	return (
		<div ref={wrapperRef} className={cn('relative overflow-hidden', wrapperClassName)}>
			<img ref={imgRef} alt={alt} className={cn('w-full h-full object-cover will-change-transform', className)} {...imgProps} />
		</div>
	);
};
