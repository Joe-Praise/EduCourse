import { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, Printer, Award } from 'lucide-react';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { LoadingEffect } from '../../components/shared';
import { getCertificateApi, CertificateData, CertificateCourse } from '../../redux/api/certificateApi';

type FetchState = 'idle' | 'loading' | 'ready' | 'error';

const isCourseObject = (c: CertificateData['courseId']): c is CertificateCourse =>
	typeof c === 'object' && c !== null && 'title' in c;

const Certificate: FC = () => {
	const { id } = useParams<{ id: string }>();
	const userName = useSelector((state: RootState) => state.user.userObj?.name) ?? '';
	const [cert, setCert] = useState<CertificateData | null>(null);
	const [status, setStatus] = useState<FetchState>('idle');
	const [error, setError] = useState<string>('');

	const load = async () => {
		if (!id) return;
		setStatus('loading');
		setError('');
		const response = await getCertificateApi(id);
		if ('error' in response && response.error) {
			setStatus('error');
			setError(response.error);
			return;
		}
		setCert((response as { data: CertificateData }).data);
		setStatus('ready');
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (status === 'loading' || status === 'idle') {
		return (
			<PageLayout width='default' className='py-24 grid place-items-center'>
				<LoadingEffect />
			</PageLayout>
		);
	}

	if (status === 'error' || !cert) {
		return (
			<PageLayout width='default' className='py-24 grid place-items-center text-center'>
				<div className='max-w-md flex flex-col items-center gap-4'>
					<h2 className='font-display font-semibold text-2xl text-ink-primary'>
						Certificate not found.
					</h2>
					<p className='font-body text-sm text-ink-tertiary'>{error || 'It may have been revoked or you may not have access.'}</p>
					<Link
						to='/certificates'
						className='inline-flex items-center h-11 px-5 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors'
					>
						Back to certificates
					</Link>
				</div>
			</PageLayout>
		);
	}

	const course = isCourseObject(cert.courseId) ? cert.courseId : null;
	const courseTitle = course?.title ?? 'Course';
	const instructorName =
		course?.instructors?.[0]?.userId?.name ?? 'EduCourse Faculty';
	const earnedDate = new Date(cert.createdAt).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	const certId = cert._id.slice(-8).toUpperCase();

	return (
		<PageLayout width='default' className='pt-10 pb-24'>
			{/* Back + actions — hidden when printing */}
			<div className='flex items-center justify-between mb-8 print:hidden'>
				<Link
					to='/certificates'
					className='inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.22em] text-ink-secondary hover:text-clay-400 transition-colors'
				>
					<ChevronLeft size={13} strokeWidth={2} />
					All certificates
				</Link>
				<button
					type='button'
					onClick={() => window.print()}
					className='inline-flex items-center gap-2 h-10 px-5 rounded-pill border border-line-base hover:border-line-strong text-ink-primary font-body text-sm transition-colors'
				>
					<Printer size={14} strokeWidth={1.75} />
					Print
				</button>
			</div>

			{/* The certificate itself */}
			<article
				className='relative mx-auto max-w-4xl bg-bg-paper text-bg-base rounded-card overflow-hidden ring-1 ring-bg-base/15 print:rounded-none print:ring-0'
				style={{ aspectRatio: '1.414' /* A4 landscape proportions */ }}
			>
				{/* Soft warm wash */}
				<div
					aria-hidden
					className='absolute inset-0 pointer-events-none'
					style={{
						background:
							'radial-gradient(ellipse at top right, rgba(184,153,104,0.25) 0%, transparent 55%), radial-gradient(ellipse at bottom left, rgba(200,71,46,0.12) 0%, transparent 60%)',
					}}
				/>

				{/* Inset frame */}
				<div className='absolute inset-6 sm:inset-10 border border-bg-base/20 pointer-events-none' />

				<div className='relative h-full px-8 sm:px-16 py-10 sm:py-14 flex flex-col'>
					{/* Top bar — seal + identifier */}
					<header className='flex items-start justify-between'>
						<span className='inline-flex items-center gap-2'>
							<span className='inline-grid place-items-center h-10 w-10 rounded-full bg-sienna-500/20 text-sienna-600'>
								<Award size={18} strokeWidth={1.75} />
							</span>
							<span className='font-mono text-2xs uppercase tracking-[0.28em] text-bg-base/75'>
								EduCourse
							</span>
						</span>
						<span className='font-mono text-2xs uppercase tracking-[0.22em] text-bg-base/55 tabular-nums'>
							No. {certId}
						</span>
					</header>

					{/* Middle — eyebrow + name + course */}
					<div className='flex-1 flex flex-col justify-center text-center'>
						<span className='font-mono text-2xs uppercase tracking-[0.32em] text-clay-500'>
							Certificate of completion
						</span>
						<p
							className='mt-6 font-display italic text-bg-base/70'
							style={{ fontSize: 'clamp(14px, 1.4vw, 18px)', fontVariationSettings: '"opsz" 32' }}
						>
							This is to certify that
						</p>
						<h1
							className='mt-4 font-display font-semibold text-bg-base leading-[1.0] tracking-[-0.04em]'
							style={{
								fontSize: 'clamp(40px, 5.5vw, 72px)',
								fontVariationSettings: '"opsz" 144',
							}}
						>
							{userName || 'EduCourse Student'}
						</h1>
						<p
							className='mt-6 font-display italic text-bg-base/70'
							style={{ fontSize: 'clamp(14px, 1.4vw, 18px)', fontVariationSettings: '"opsz" 32' }}
						>
							has successfully completed
						</p>
						<h2
							className='mt-3 font-display font-medium text-bg-base/90 leading-[1.15] tracking-[-0.02em] max-w-3xl mx-auto'
							style={{
								fontSize: 'clamp(20px, 2.6vw, 32px)',
								fontVariationSettings: '"opsz" 96',
							}}
						>
							{courseTitle}
						</h2>
					</div>

					{/* Bottom signature row */}
					<footer className='grid grid-cols-1 sm:grid-cols-3 gap-8 items-end'>
						<div className='flex flex-col gap-1.5'>
							<span aria-hidden className='block h-px bg-bg-base/30' />
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-bg-base/55'>
								Awarded
							</span>
							<span
								className='font-display italic text-bg-base'
								style={{ fontSize: '16px', fontVariationSettings: '"opsz" 36' }}
							>
								{earnedDate}
							</span>
						</div>
						<div className='flex flex-col items-center gap-1.5 text-center'>
							<span aria-hidden className='block h-1.5 w-1.5 rounded-full bg-clay-500' />
							<span className='font-mono text-2xs uppercase tracking-[0.28em] text-bg-base/55'>
								Sealed
							</span>
						</div>
						<div className='flex flex-col gap-1.5 text-right'>
							<span aria-hidden className='block h-px bg-bg-base/30' />
							<span className='font-mono text-2xs uppercase tracking-[0.22em] text-bg-base/55'>
								Instructor
							</span>
							<span
								className='font-display italic text-bg-base'
								style={{ fontSize: '16px', fontVariationSettings: '"opsz" 36' }}
							>
								{instructorName}
							</span>
						</div>
					</footer>
				</div>
			</article>
		</PageLayout>
	);
};

export default Certificate;
