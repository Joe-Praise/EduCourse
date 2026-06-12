import { useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
	src?: string | null;
	fallback?: string;
	size?: AvatarSize;
	alt?: string;
}

const sizeClass: Record<AvatarSize, string> = {
	xs: 'h-6 w-6 text-2xs',
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-14 w-14 text-base',
	xl: 'h-20 w-20 text-xl',
};

const getInitials = (label: string): string => {
	const parts = label.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return '?';
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Avatar = ({
	src,
	fallback = '',
	size = 'md',
	alt,
	className,
	...rest
}: AvatarProps) => {
	const [errored, setErrored] = useState<boolean>(false);
	const showImage = src && !errored;

	return (
		<span
			className={cn(
				'inline-grid place-items-center overflow-hidden rounded-full bg-bg-overlay text-ink-secondary font-display font-medium border border-line-base',
				sizeClass[size],
				className,
			)}
			{...rest}
		>
			{showImage ? (
				<img
					src={src}
					alt={alt ?? fallback}
					loading='lazy'
					decoding='async'
					onError={() => setErrored(true)}
					className='h-full w-full object-cover'
				/>
			) : (
				<span aria-hidden>{getInitials(fallback)}</span>
			)}
		</span>
	);
};
