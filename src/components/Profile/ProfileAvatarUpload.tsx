import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, X } from 'lucide-react';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import { updateUser } from '../../redux/actions/userAction';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import defaultAvi from '../../assets/image/Ellipse 1.jpg';
import { DropZone, ImageCropper } from '../../features/upload';
import { cn } from '../../lib/cn';

type Status = 'idle' | 'uploading' | 'success' | 'error';

const ProfileAvatarUpload = () => {
	const dispatch: AppDispatch = useDispatch();
	const userObj = useSelector((state: RootState) => state.user.userObj);

	const [pendingSrc, setPendingSrc] = useState<string | null>(null);
	const [status, setStatus] = useState<Status>('idle');
	const [error, setError] = useState<string | null>(null);

	const avatarSrc = userObj?.photo ? imgSrc(userObj.photo, '/img/', TRANSFORMS.avatarLg) : defaultAvi;

	const handleFiles = (files: File[]) => {
		const file = files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') setPendingSrc(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleCropped = async (croppedDataUrl: string) => {
		setPendingSrc(null);
		setError(null);
		setStatus('uploading');
		try {
			const res = await fetch(croppedDataUrl);
			const blob = await res.blob();
			const file = new File([blob], `avatar-${Date.now()}.jpg`, {
				type: blob.type || 'image/jpeg',
			});
			const formData = new FormData();
			formData.append('photo', file);
			await dispatch(updateUser(formData));
			setStatus('success');
			window.setTimeout(() => setStatus('idle'), 2000);
		} catch (err) {
			setStatus('error');
			setError(err instanceof Error ? err.message : 'Upload failed');
		}
	};

	return (
		<div className='flex flex-col sm:flex-row items-start gap-6'>
			{/* Current avatar */}
			<div className='relative w-28 h-28 rounded-full overflow-hidden border border-line-base shrink-0'>
				<img src={avatarSrc} alt='Profile avatar' className='w-full h-full object-cover' />
				{status === 'uploading' && (
					<div className='absolute inset-0 grid place-items-center bg-bg-base/70 backdrop-blur-sm'>
						<span
							className='inline-block h-6 w-6 rounded-full border-2 border-clay-500 border-t-transparent animate-spin'
							aria-hidden
						/>
					</div>
				)}
			</div>

			{/* Drop zone */}
			<div className='flex-1 w-full min-w-0'>
				<DropZone
					accept='image/*'
					multiple={false}
					maxSizeMB={2}
					onFiles={handleFiles}
					hint='Square crop · JPG / PNG · Max 2MB'
					aspectClass='aspect-[3/1]'
				>
					<div className='px-4 text-center'>
						<span className='inline-grid place-items-center h-9 w-9 rounded-full bg-bg-overlay text-ink-tertiary mx-auto'>
							<Camera size={14} strokeWidth={1.75} />
						</span>
						<p className='mt-2 font-display font-medium text-sm text-ink-primary'>
							Drop a new avatar
						</p>
						<p className='font-body text-2xs text-ink-tertiary'>
							We'll let you crop it square.
						</p>
					</div>
				</DropZone>
				<p
					className={cn(
						'mt-2 font-body text-xs',
						status === 'success' && 'text-signal-success',
						status === 'error' && 'text-signal-danger',
						(status === 'idle' || status === 'uploading') && 'text-ink-tertiary',
					)}
				>
					{status === 'success' && 'Avatar updated.'}
					{status === 'error' && (error ?? 'Upload failed.')}
					{status === 'uploading' && 'Uploading…'}
					{status === 'idle' && 'PNG or JPG, served from /img/<filename> after upload.'}
				</p>
			</div>

			{/* Cropper modal — overflow-y-auto so the Save button is always reachable on tall images */}
			{pendingSrc && (
				<div
					className='fixed inset-0 z-50 overflow-y-auto'
					role='dialog'
					aria-modal='true'
					aria-label='Crop avatar'
				>
					<div className='flex min-h-full items-center justify-center p-4'>
						<div
							onClick={() => setPendingSrc(null)}
							className='fixed inset-0 bg-black/70 backdrop-blur-sm'
						/>
						<div className='relative w-full max-w-xl glass-strong rounded-card p-6 shadow-warm-3 my-4'>
							<header className='mb-4 flex items-center justify-between'>
								<h3 className='font-display font-semibold text-lg text-ink-primary'>
									Crop your avatar
								</h3>
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
								aspect={1}
								onComplete={handleCropped}
								onCancel={() => setPendingSrc(null)}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileAvatarUpload;
