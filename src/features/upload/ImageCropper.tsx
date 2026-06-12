import { useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Check, RotateCcw } from 'lucide-react';

interface ImageCropperProps {
	src: string;
	aspect?: number; // width/height ratio (e.g. 16/9)
	onComplete: (croppedDataUrl: string) => void;
	onCancel: () => void;
}

const initialCenteredCrop = (
	mediaWidth: number,
	mediaHeight: number,
	aspect: number,
): Crop =>
	centerCrop(
		makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
		mediaWidth,
		mediaHeight,
	);

export const ImageCropper = ({ src, aspect = 16 / 9, onComplete, onCancel }: ImageCropperProps) => {
	const [crop, setCrop] = useState<Crop>();
	const [completed, setCompleted] = useState<PixelCrop | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);

	const handleConfirm = () => {
		const image = imgRef.current;
		if (!image || !completed) return;
		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = completed.width * scaleX;
		canvas.height = completed.height * scaleY;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.drawImage(
			image,
			completed.x * scaleX,
			completed.y * scaleY,
			completed.width * scaleX,
			completed.height * scaleY,
			0,
			0,
			canvas.width,
			canvas.height,
		);
		onComplete(canvas.toDataURL('image/jpeg', 0.92));
	};

	return (
		<div className='space-y-4'>
			<div className='rounded-card overflow-hidden bg-bg-sunken border border-line-base p-3 max-h-[55vh]'>
				<ReactCrop
					crop={crop}
					onChange={(c) => setCrop(c)}
					onComplete={(c) => setCompleted(c)}
					aspect={aspect}
					keepSelection
				>
					<img
						ref={imgRef}
						src={src}
						alt=''
						onLoad={(e) => {
							const { naturalWidth, naturalHeight } = e.currentTarget;
							setCrop(initialCenteredCrop(naturalWidth, naturalHeight, aspect));
						}}
						className='max-h-[55vh] w-auto mx-auto block'
					/>
				</ReactCrop>
			</div>
			<div className='flex justify-end gap-2'>
				<button
					type='button'
					onClick={onCancel}
					className='inline-flex items-center gap-2 h-10 px-4 rounded-pill border border-line-base text-ink-secondary hover:text-ink-primary hover:border-line-strong font-body text-sm transition-colors'
				>
					<RotateCcw size={14} strokeWidth={2} />
					Pick another
				</button>
				<button
					type='button'
					onClick={handleConfirm}
					disabled={!completed}
					className='inline-flex items-center gap-2 h-10 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
				>
					<Check size={14} strokeWidth={2} />
					Use this crop
				</button>
			</div>
		</div>
	);
};
