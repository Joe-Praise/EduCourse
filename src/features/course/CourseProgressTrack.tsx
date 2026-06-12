import { cn } from '../../lib/cn';

interface CourseProgressTrackProps {
	value: number;
	className?: string;
}

export const CourseProgressTrack = ({ value, className }: CourseProgressTrackProps) => {
	const clamped = Math.max(0, Math.min(100, value));
	return (
		<div
			role='progressbar'
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(clamped)}
			className={cn('h-1.5 w-full rounded-pill bg-line-subtle overflow-hidden', className)}
		>
			<div
				className='h-full rounded-pill bg-gradient-to-r from-brand-500 to-brand-400 transition-[width] duration-slow ease-out-quart motion-reduce:transition-none'
				style={{ width: `${clamped}%` }}
			/>
		</div>
	);
};
