import { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	BuilderShell,
	useBuilderState,
	StepBasics,
	StepOutcomes,
	StepCurriculum,
	StepPricing,
	StepCover,
	StepReview,
	publishDraft,
	updateDraft,
	type StepKey,
	type PublishStep,
} from '../../features/builder';
import { RootState } from '../../redux/reducers';

const stepLabels: Record<PublishStep['kind'], string> = {
	'creating-course': 'Creating course…',
	'uploading-cover': 'Uploading cover…',
	'creating-modules': 'Creating modules…',
	'creating-lessons': 'Creating lessons…',
	'submitting-for-review': 'Submitting for review…',
	done: 'Published.',
};

const CourseBuilder: FC = () => {
	const { courseId } = useParams<{ courseId?: string }>();
	const isEdit = !!courseId;
	const navigate = useNavigate();
	const instructorProfile = useSelector(
		(state: RootState) => state.instructorDashboard.instructorProfile,
	);
	const { draft, update, saveStatus, reset, loading } = useBuilderState(courseId ?? 'new');
	const [step, setStep] = useState<StepKey>('basics');
	const [publishing, setPublishing] = useState<boolean>(false);
	const [publishStep, setPublishStep] = useState<PublishStep['kind'] | null>(null);
	const [publishError, setPublishError] = useState<string | null>(null);

	const canPublish =
		!publishing &&
		draft.title.trim().length >= 4 &&
		draft.outcomes.some((o) => o.trim().length > 0) &&
		draft.modules.length > 0 &&
		!!draft.coverImage &&
		!!draft.categoryId;

	const canSave = !publishing && draft.title.trim().length >= 4;

	const handlePublish = async () => {
		if (!canPublish) return;
		setPublishing(true);
		setPublishError(null);
		setPublishStep('creating-course');
		try {
			const result = await publishDraft(draft, {
				instructorId: instructorProfile?._id,
				submitForReview: true,
				onProgress: (s) => setPublishStep(s.kind),
			});
			reset();
			navigate(`/courses/${result.slug}`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Publish failed';
			setPublishError(message);
		} finally {
			setPublishing(false);
		}
	};

	const handleSave = async () => {
		if (!courseId || !canSave) return;
		setPublishing(true);
		setPublishError(null);
		try {
			await updateDraft(courseId, draft);
			navigate('/instructor/dashboard');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Save failed';
			setPublishError(message);
		} finally {
			setPublishing(false);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-bg-base flex items-center justify-center'>
				<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary animate-pulse'>
					Loading course…
				</span>
			</div>
		);
	}

	const renderStep = () => {
		switch (step) {
			case 'basics':
				return <StepBasics draft={draft} update={update} />;
			case 'outcomes':
				return <StepOutcomes draft={draft} update={update} />;
			case 'curriculum':
				return <StepCurriculum draft={draft} update={update} />;
			case 'pricing':
				return <StepPricing draft={draft} update={update} />;
			case 'cover':
				return <StepCover draft={draft} update={update} />;
			case 'review':
				return (
					<div className='space-y-8'>
						<StepReview draft={draft} onJumpToStep={setStep} />
						{(publishing || publishError) && (
							<div
								role={publishError ? 'alert' : 'status'}
								className='rounded-card border border-line-base bg-bg-raised p-5'
							>
								{publishing && publishStep && (
									<div className='flex items-center gap-3'>
										<span className='inline-block h-2 w-2 rounded-full bg-clay-500 animate-pulse' aria-hidden />
										<span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary'>
											{stepLabels[publishStep]}
										</span>
									</div>
								)}
								{publishError && !publishing && (
									<div>
										<p className='font-display font-semibold text-sm text-signal-danger'>
											{isEdit ? 'Save failed' : 'Publish failed'}
										</p>
										<p className='mt-1 font-body text-xs text-ink-tertiary'>{publishError}</p>
									</div>
								)}
							</div>
						)}
					</div>
				);
		}
	};

	return (
		<BuilderShell
			currentStep={step}
			onChangeStep={setStep}
			saveStatus={saveStatus}
			onPublish={isEdit ? handleSave : handlePublish}
			canPublish={isEdit ? canSave : canPublish}
			publishLabel={isEdit ? 'Save changes' : undefined}
		>
			{renderStep()}
		</BuilderShell>
	);
};

export default CourseBuilder;
