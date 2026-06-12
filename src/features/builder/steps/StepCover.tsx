import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { TextField, TextAreaField } from './BuilderField';
import { DropZone, ImageCropper } from '../../upload';
import { type CourseDraft } from '../types';

interface StepCoverProps {
	draft: CourseDraft;
	update: <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => void;
}

export const StepCover = ({ draft, update }: StepCoverProps) => {
	const [pendingSrc, setPendingSrc] = useState<string | null>(null);

	const handleFiles = (files: File[]) => {
		const file = files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') setPendingSrc(reader.result);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className='space-y-10 max-w-2xl'>
			{/* Cover image */}
			<section>
				<label className='block font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary mb-3'>
					Cover image <span className='text-clay-400'>*</span>
				</label>
				{draft.coverImage ? (
					<div className='relative aspect-[16/9] rounded-card overflow-hidden border border-line-base group'>
						<img src={draft.coverImage} alt='' className='absolute inset-0 h-full w-full object-cover' />
						<div className='absolute inset-0 bg-bg-base/0 group-hover:bg-bg-base/40 transition-colors flex items-end justify-end p-3 gap-2'>
							<button
								type='button'
								onClick={() => setPendingSrc(draft.coverImage)}
								className='inline-flex items-center gap-2 h-9 px-4 rounded-pill glass border border-line-base text-ink-primary font-body text-xs opacity-0 group-hover:opacity-100 transition-opacity'
							>
								<Upload size={12} strokeWidth={2} />
								Re-crop
							</button>
							<button
								type='button'
								onClick={() => update('coverImage', null)}
								aria-label='Remove cover'
								className='inline-grid place-items-center h-9 w-9 rounded-full glass border border-line-base text-ink-primary opacity-0 group-hover:opacity-100 transition-opacity'
							>
								<X size={14} strokeWidth={2} />
							</button>
						</div>
					</div>
				) : (
					<DropZone
						accept='image/*'
						multiple={false}
						maxSizeMB={4}
						onFiles={handleFiles}
						hint='16:9 ratio · JPG / PNG / WebP · Max 4MB'
						aspectClass='aspect-[16/9]'
					/>
				)}
			</section>

			<TextField
				label='Promo video URL'
				value={draft.promoVideoUrl}
				onChange={(e) => update('promoVideoUrl', e.target.value)}
				placeholder='https://youtube.com/watch?v=… (optional)'
				hint='YouTube or Vimeo URL — shown above the curriculum.'
			/>

			<TextAreaField
				label='Short description'
				required
				rows={3}
				value={draft.shortDescription}
				onChange={(e) => update('shortDescription', e.target.value)}
				placeholder='One sentence that lands.'
				hint='Shown in card previews.'
			/>

			<TextAreaField
				label='Long description'
				rows={8}
				value={draft.longDescription}
				onChange={(e) => update('longDescription', e.target.value)}
				placeholder='Why this course exists. What people get. Who it is for.'
				hint='Shown on the course page lead.'
			/>

			{/* Cropper modal */}
			{pendingSrc && (
				<div
					className='fixed inset-0 z-50 grid place-items-center p-4'
					role='dialog'
					aria-modal='true'
					aria-label='Crop cover image'
				>
					<div
						onClick={() => setPendingSrc(null)}
						className='absolute inset-0 bg-black/70 backdrop-blur-sm'
					/>
					<div className='relative w-full max-w-3xl glass-strong rounded-card p-6 shadow-warm-3'>
						<header className='mb-4 flex items-center justify-between'>
							<h3 className='font-display font-semibold text-lg text-ink-primary'>Crop your cover</h3>
							<button
								type='button'
								onClick={() => setPendingSrc(null)}
								aria-label='Close'
								className='inline-grid place-items-center h-8 w-8 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors'
							>
								<X size={14} strokeWidth={2} />
							</button>
						</header>
						<ImageCropper
							src={pendingSrc}
							aspect={16 / 9}
							onComplete={(cropped) => {
								update('coverImage', cropped);
								setPendingSrc(null);
							}}
							onCancel={() => setPendingSrc(null)}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
