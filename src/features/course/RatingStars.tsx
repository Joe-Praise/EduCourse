import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';

interface RatingStarsProps {
	/** 0–5; filled stars are rounded to the nearest whole star. */
	rating: number;
	size?: number;
	className?: string;
}

/** Read-only five-star rating. The one star display used across course ratings. */
export const RatingStars = ({ rating, size = 14, className }: RatingStarsProps) => {
	const filled = Math.round(rating);
	return (
		<span
			role='img'
			aria-label={`Rated ${Math.round(rating * 10) / 10} out of 5`}
			className={cn('inline-flex items-center gap-0.5', className)}
		>
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					size={size}
					strokeWidth={1.5}
					aria-hidden
					className={n <= filled ? 'fill-clay-400 text-clay-400' : 'text-line-strong'}
				/>
			))}
		</span>
	);
};
