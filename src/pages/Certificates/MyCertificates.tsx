import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Award, ArrowUpRight } from 'lucide-react';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { LoadingEffect } from '../../components/shared';
import { getMyCertificatesApi, CertificateData, CertificateCourse } from '../../redux/api/certificateApi';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';

type FetchState = 'idle' | 'loading' | 'ready' | 'error';

const isCourseObject = (c: CertificateData['courseId']): c is CertificateCourse =>
	typeof c === 'object' && c !== null && 'title' in c;

const MyCertificates: FC = () => {
	const userName = useSelector((state: RootState) => state.user.userObj?.name) ?? '';
	const [items, setItems] = useState<CertificateData[]>([]);
	const [status, setStatus] = useState<FetchState>('idle');
	const [error, setError] = useState<string>('');

	const load = async () => {
		setStatus('loading');
		setError('');
		const response = await getMyCertificatesApi();
		if ('error' in response && response.error) {
			setStatus('error');
			setError(response.error);
			return;
		}
		setItems((response as { data: CertificateData[] }).data ?? []);
		setStatus('ready');
	};

	useEffect(() => {
		load();

	}, []);

	return (
		<PageLayout width='default' className='pt-16 sm:pt-24 pb-32'>
			<header className='mb-12'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					Earned · {items.length}
				</span>
				<Reveal
					mode='word-split'
					as='h1'
					className='mt-3 font-display font-semibold text-5xl sm:text-6xl lg:text-7xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
				>
					Your certificates.
				</Reveal>
				<p className='mt-6 max-w-xl font-body text-lg text-ink-secondary leading-[1.6]'>
					Every course you&apos;ve completed. Open one to view, save, or print it.
				</p>
			</header>

			{status === 'loading' && (
				<div className='py-24 grid place-items-center'>
					<LoadingEffect />
				</div>
			)}

			{status === 'error' && (
				<div className='py-24 grid place-items-center text-center'>
					<div className='max-w-md flex flex-col items-center gap-4'>
						<h2 className='font-display font-semibold text-2xl text-ink-primary'>
							We couldn&apos;t load your certificates.
						</h2>
						<p className='font-body text-sm text-ink-tertiary'>{error || 'Try again in a moment.'}</p>
						<button
							type='button'
							onClick={load}
							className='inline-flex items-center h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Try again
						</button>
					</div>
				</div>
			)}

			{status === 'ready' && items.length === 0 && (
				<div className='py-24 grid place-items-center text-center'>
					<div className='max-w-md'>
						<span className='inline-grid place-items-center h-16 w-16 rounded-full bg-bg-overlay text-ink-tertiary mx-auto'>
							<Award size={22} strokeWidth={1.5} />
						</span>
						<h3 className='mt-6 font-display font-semibold text-3xl text-ink-primary tracking-[-0.02em]'>
							No certificates yet.
						</h3>
						<p className='mt-2 font-body text-sm text-ink-tertiary'>
							Finish a course end-to-end and your certificate will appear here.
						</p>
						<Link
							to='/my-courses/learning'
							className='mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
						>
							Continue learning
							<ArrowUpRight size={14} strokeWidth={2} />
						</Link>
					</div>
				</div>
			)}

			{status === 'ready' && items.length > 0 && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
					{items.map((cert) => {
						const course = isCourseObject(cert.courseId) ? cert.courseId : null;
						const courseTitle = course?.title ?? 'Course';
						const earnedDate = new Date(cert.createdAt).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						});
						return (
							<Link
								key={cert._id}
								to={`/certificates/${cert._id}`}
								className='group block rounded-card border border-line-subtle bg-bg-raised hover:border-line-base hover:bg-bg-overlay/40 transition-[border-color,background-color] duration-base ease-out-quart overflow-hidden'
							>
								{/* Cover */}
								<div className='aspect-[16/9] relative overflow-hidden bg-bg-sunken'>
									{course?.imageCover ? (
										<img
											src={imgSrc(course.imageCover, '/course/', TRANSFORMS.courseCoverCard)}
											alt=''
											loading='lazy'
											className='absolute inset-0 h-full w-full object-cover'
										/>
									) : (
										<div className='absolute inset-0 grid place-items-center bg-gradient-to-br from-sienna-500/30 via-ivory-300/10 to-bg-sunken'>
											<Award size={40} strokeWidth={1.25} className='text-ink-tertiary' />
										</div>
									)}
									<div className='absolute inset-0 bg-gradient-to-t from-bg-base/85 via-bg-base/30 to-transparent' />
									<span className='absolute top-3 right-3 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.18em] text-clay-400 bg-bg-base/70 backdrop-blur-sm px-2.5 py-1 rounded-pill border border-line-subtle'>
										<Award size={11} strokeWidth={2} />
										Certified
									</span>
								</div>

								{/* Body */}
								<div className='p-5'>
									<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
										Awarded · {earnedDate}
									</span>
									<h3
										className='mt-2 font-display font-semibold text-lg sm:text-xl text-ink-primary tracking-[-0.01em] line-clamp-2 leading-[1.2]'
										style={{ fontVariationSettings: '"opsz" 32' }}
									>
										{courseTitle}
									</h3>
									<p className='mt-3 font-body text-xs text-ink-tertiary'>
										For: <span className='text-ink-secondary'>{userName || 'You'}</span>
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</PageLayout>
	);
};

export default MyCertificates;
