import { FC, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, MailCheck } from 'lucide-react';
import FormLayout from '../../widgets/FormLayout';
import { forgotPasswordAction } from '../../redux/actions/authAction';
import { AppDispatch } from '../../redux/store';
import { EditorialInput } from '../../components/Signin/EditorialInput';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';
import img from '../../assets/image/card5.jpg';

interface FormValues {
	email: string;
}

const initialValues: FormValues = { email: '' };

const validationSchema = Yup.object({
	email: Yup.string()
		.required('Please enter your email')
		.email('Please enter a valid email address'),
});

const ForgotPassword: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const [loading, setLoading] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);

	const onSubmit = async (values: FormValues) => {
		setLoading(true);
		const result = await dispatch(forgotPasswordAction(values.email));
		setLoading(false);
		if (result?.ok) setSubmitted(true);
	};

	return (
		<FormLayout
			imageSide='left'
			imageSrc={img}
			caption='“A small reset, a long road back.”'
		>
			<div className='w-full'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					Reset access
				</span>
				<h1
					className='mt-4 font-display font-semibold text-ink-primary leading-[0.95] tracking-[-0.04em]'
					style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontVariationSettings: '"opsz" 144' }}
				>
					Forgot{' '}
					<em
						className='font-display italic font-semibold text-clay-500'
						style={{ fontVariationSettings: '"opsz" 144' }}
					>
						password?
					</em>
				</h1>
				<p className='mt-4 font-body text-base text-ink-secondary leading-[1.55]'>
					Enter the email tied to your account — we'll send a reset link that expires in
					ten minutes.
				</p>

				{submitted ? (
					<div className='mt-10 space-y-6'>
						<div className='flex items-start gap-3 rounded-card border border-signal-success/30 bg-signal-success/10 p-4'>
							<MailCheck size={16} strokeWidth={2} className='text-signal-success shrink-0 mt-0.5' />
							<p className='font-body text-sm text-ink-primary leading-[1.55]'>
								If an account with that email exists, a reset link is on its way. Check your
								inbox — it expires in 10 minutes.
							</p>
						</div>
						<Link
							to='/signin'
							className='block font-body text-sm text-clay-400 hover:text-clay-500 transition-colors text-center'
						>
							← Back to sign in
						</Link>
					</div>
				) : (
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
					>
						{({
							values,
							handleChange,
							handleBlur,
							handleSubmit,
							errors,
							touched,
						}) => (
							<form
								className='mt-10 space-y-1'
								onSubmit={(e) => {
									e.preventDefault();
									handleSubmit();
								}}
							>
								<EditorialInput
									name='email'
									type='email'
									label='Email'
									autoComplete='email'
									required
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.email}
									touched={touched.email}
								/>

								<div className='pt-4'>
									<Magnetic strength={0.18}>
										<button
											type='submit'
											disabled={loading}
											data-cursor='grow'
											className='group inline-flex w-full items-center justify-center gap-3 h-14 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors duration-base disabled:opacity-60 disabled:cursor-not-allowed'
										>
											<span>{loading ? 'Sending…' : 'Send reset link'}</span>
											<span className='inline-grid place-items-center h-9 w-9 rounded-full bg-ink-primary text-bg-base transition-transform duration-base ease-out-quart group-hover:translate-x-0.5'>
												<ArrowRight size={14} strokeWidth={2.5} />
											</span>
										</button>
									</Magnetic>
								</div>

								<div className='mt-8 flex items-center justify-between gap-4 text-sm'>
									<Link
										to='/signin'
										className='font-body text-ink-tertiary hover:text-ink-primary transition-colors'
									>
										← Back to sign in
									</Link>
									<Link
										to='/signup'
										className='font-body text-clay-400 hover:text-clay-500 transition-colors'
									>
										Create account
									</Link>
								</div>
							</form>
						)}
					</Formik>
				)}
			</div>
		</FormLayout>
	);
};

export default ForgotPassword;
