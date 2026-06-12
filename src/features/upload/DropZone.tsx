import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface DropZoneProps {
	accept?: string;
	multiple?: boolean;
	onFiles: (files: File[]) => void;
	maxSizeMB?: number;
	hint?: string;
	className?: string;
	children?: ReactNode;
	aspectClass?: string;
}

export const DropZone = ({
	accept = 'image/*',
	multiple = false,
	onFiles,
	maxSizeMB = 4,
	hint,
	className,
	children,
	aspectClass = 'aspect-[16/9]',
}: DropZoneProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isOver, setIsOver] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		const arr = Array.from(files);
		const oversized = arr.find((f) => f.size > maxSizeMB * 1024 * 1024);
		if (oversized) {
			setError(`File "${oversized.name}" exceeds ${maxSizeMB} MB`);
			return;
		}
		setError(null);
		onFiles(multiple ? arr : arr.slice(0, 1));
	};

	const onDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsOver(false);
		handleFiles(e.dataTransfer.files);
	};

	const onDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsOver(true);
	};

	const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsOver(false);
	};

	return (
		<div className={className}>
			<div
				role='button'
				tabIndex={0}
				onClick={() => inputRef.current?.click()}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						inputRef.current?.click();
					}
				}}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				className={cn(
					aspectClass,
					'w-full rounded-card border-2 border-dashed grid place-items-center text-center cursor-pointer',
					'transition-[border-color,background-color] duration-base',
					isOver
						? 'border-clay-500 bg-clay-500/10'
						: 'border-line-base hover:border-clay-500/60 hover:bg-clay-500/5',
					'focus:outline-none focus-visible:shadow-focus-ring',
				)}
			>
				{children ?? (
					<div className='px-4'>
						<span className={cn(
							'inline-grid place-items-center h-12 w-12 rounded-full mx-auto transition-colors',
							isOver ? 'bg-clay-500/20 text-clay-400' : 'bg-bg-overlay text-ink-tertiary',
						)}>
							{isOver ? <Upload size={20} strokeWidth={1.75} /> : <ImageIcon size={20} strokeWidth={1.75} />}
						</span>
						<p className='mt-4 font-display font-medium text-base text-ink-primary'>
							{isOver ? 'Release to upload' : 'Drop a file here, or click to browse'}
						</p>
						{hint && <p className='mt-1 font-body text-xs text-ink-tertiary'>{hint}</p>}
					</div>
				)}
				<input
					ref={inputRef}
					type='file'
					accept={accept}
					multiple={multiple}
					className='sr-only'
					onChange={(e) => handleFiles(e.target.files)}
				/>
			</div>
			{error && (
				<p className='mt-2 font-body text-xs text-signal-danger' role='alert'>
					{error}
				</p>
			)}
		</div>
	);
};
