import { X, FileImage, FileVideo, File as FileIcon, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

interface UploadJob {
	id: string;
	file: File;
	progress: number;
	status: 'idle' | 'uploading' | 'success' | 'error';
	error?: string;
}

interface UploadQueueProps {
	jobs: ReadonlyArray<UploadJob>;
	onCancel?: (id: string) => void;
	className?: string;
}

const formatSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const iconFor = (file: File) => {
	if (file.type.startsWith('image/')) return FileImage;
	if (file.type.startsWith('video/')) return FileVideo;
	return FileIcon;
};

export const UploadQueue = ({ jobs, onCancel, className }: UploadQueueProps) => {
	if (jobs.length === 0) return null;

	return (
		<ul className={cn('space-y-2', className)}>
			{jobs.map((job) => {
				const Icon = iconFor(job.file);
				return (
					<li
						key={job.id}
						className='flex items-center gap-3 p-3 rounded-card bg-bg-raised border border-line-subtle'
					>
						<span className='inline-grid place-items-center h-9 w-9 rounded-card bg-bg-overlay text-ink-secondary shrink-0'>
							<Icon size={14} strokeWidth={1.75} />
						</span>
						<div className='flex-1 min-w-0'>
							<div className='flex items-center justify-between gap-3'>
								<p className='font-body text-sm text-ink-primary truncate'>{job.file.name}</p>
								<span className='font-mono text-2xs uppercase tracking-[0.14em] text-ink-tertiary shrink-0'>
									{formatSize(job.file.size)}
								</span>
							</div>
							<div className='mt-2 h-1 rounded-pill bg-line-subtle overflow-hidden'>
								<div
									className={cn(
										'h-full rounded-pill transition-[width] duration-base ease-out-quart',
										job.status === 'error' ? 'bg-signal-danger' : 'bg-clay-500',
									)}
									style={{ width: `${job.progress}%` }}
								/>
							</div>
							{job.error && (
								<p className='mt-1 font-body text-2xs text-signal-danger'>{job.error}</p>
							)}
						</div>
						{job.status === 'success' ? (
							<span className='inline-grid place-items-center h-7 w-7 rounded-full bg-signal-success/15 text-signal-success shrink-0'>
								<Check size={12} strokeWidth={2.5} />
							</span>
						) : job.status === 'error' ? (
							<span className='inline-grid place-items-center h-7 w-7 rounded-full bg-signal-danger/15 text-signal-danger shrink-0'>
								<AlertCircle size={12} strokeWidth={2} />
							</span>
						) : (
							onCancel && (
								<button
									type='button'
									onClick={() => onCancel(job.id)}
									aria-label='Cancel upload'
									className='inline-grid place-items-center h-7 w-7 rounded-full text-ink-tertiary hover:text-signal-danger transition-colors shrink-0'
								>
									<X size={12} strokeWidth={2} />
								</button>
							)
						)}
					</li>
				);
			})}
		</ul>
	);
};
