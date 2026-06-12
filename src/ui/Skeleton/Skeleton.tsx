import { useEffect, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type SkeletonVariant = 'text' | 'block' | 'circle';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	variant?: SkeletonVariant;
	lines?: number;
	width?: string;
	height?: string;
	delay?: number;
}

const baseClass =
	'relative overflow-hidden bg-bg-overlay before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:animate-[shimmer_1.5s_infinite]';

export const Skeleton = ({
	variant = 'block',
	lines = 1,
	width,
	height,
	delay = 200,
	className,
	style,
	...rest
}: SkeletonProps) => {
	const [show, setShow] = useState<boolean>(delay === 0);

	useEffect(() => {
		if (delay === 0) return;
		const t = window.setTimeout(() => setShow(true), delay);
		return () => window.clearTimeout(t);
	}, [delay]);

	if (!show) {
		return <div className={cn('invisible', className)} style={{ width, height, ...style }} {...rest} />;
	}

	if (variant === 'text') {
		return (
			<div className={cn('flex flex-col gap-2', className)} {...rest}>
				{Array.from({ length: lines }).map((_, idx) => (
					<span
						key={idx}
						className={cn(baseClass, 'h-3 rounded-sm')}
						style={{
							width: idx === lines - 1 && lines > 1 ? '70%' : '100%',
						}}
					/>
				))}
			</div>
		);
	}

	if (variant === 'circle') {
		return (
			<div
				className={cn(baseClass, 'rounded-full', className)}
				style={{ width: width ?? '40px', height: height ?? '40px', ...style }}
				{...rest}
			/>
		);
	}

	return (
		<div
			className={cn(baseClass, 'rounded-card', className)}
			style={{ width: width ?? '100%', height: height ?? '120px', ...style }}
			{...rest}
		/>
	);
};
