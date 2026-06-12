import { FC, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import FormLayout from '../../widgets/FormLayout';
import { resetPasswordAction } from '../../redux/actions/authAction';
import { AppDispatch } from '../../redux/store';
import { EditorialInput } from '../../components/Signin/EditorialInput';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';
import img from '../../assets/image/card5.jpg';

interface FormValues {
	password: string;
	confirmPassword: string;
}

const initialValues: FormValues = { password: '', confirmPassword: '' };

const validationSchema = Yup.object({
	password: Yup.string()
		.required('Please enter your new password')
		.min(8, 'Password must be at least 8 characters long'),
	confirmPassword: Yup.string()
		.required('Please confirm your password')
		.oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const ResetPassword: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useParams<{ token: string }>();
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (values: FormValues) => {
		if (!token) return;
		setLoading(true);
		await dispatch(resetPasswordAction(token, values, navigate));
		setLoading(false);
	};

	return (
		<FormLayout
			imageSide='left'
			imageSrc={img}
			caption='“The page you turn before the next chapter.”'
		>
			<div className='w-full'>
				<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
					Set new password
				</span>
				<h1
					className='mt-4 font-display font-semibold text-ink-primary leading-[0.95] tracking-[-0.04em]'
					style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontVariationSettings: '"opsz" 144' }}
				>
					Choose a{' '}
					<em
						className='font-display italic font-semibold text-clay-500'
						style={{ fontVariationSettings: '"opsz" 144' }}
					>
						new key.
					</em>
				</h1>
				<p className='mt-4 font-body text-base text-ink-secondary leading-[1.55]'>
					Pick a strong password — at least eight characters. You'll be signed in
					immediately after.
				</p>

				{!token ? (
					<div className='mt-10 space-y-6'>
						<div className='flex items-start gap-3 rounded-card border border-signal-danger/30 bg-signal-danger/10 p-4'>
							<AlertCircle size={16} strokeWidth={2} className='text-signal-danger shrink-0 mt-0.5' />
							<p className='font-body text-sm text-ink-primary leading-[1.55]'>
								The reset token is missing from the URL. Request a fresh link to continue.
							</p>
						</div>
						<Link
							to='/forgot-password'
							className='inline-flex items-center gap-2 font-body text-sm text-clay-400 hover:text-clay-500 transition-colors'
						>
							Request a new link
							<ArrowRight size={14} strokeWidth={2} />
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
									name='password'
									type='password'
									label='New password'
									autoComplete='new-password'
									required
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.password}
									touched={touched.password}
								/>
								<EditorialInput
									name='confirmPassword'
									type='password'
									label='Confirm new password'
									autoComplete='new-password'
									required
									value={values.confirmPassword}
									onChange={handleChange}
									onBlur={handleBlur}
									error={errors.confirmPassword}
									touched={touched.confirmPassword}
								/>

								<div className='pt-4'>
									<Magnetic strength={0.18}>
										<button
											type='submit'
											disabled={loading}
											data-cursor='grow'
											className='group inline-flex w-full items-center justify-center gap-3 h-14 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors duration-base disabled:opacity-60 disabled:cursor-not-allowed'
										>
											<span>{loading ? 'Resetting…' : 'Reset password'}</span>
											<span className='inline-grid place-items-center h-9 w-9 rounded-full bg-ink-primary text-bg-base transition-transform duration-base ease-out-quart group-hover:translate-x-0.5'>
												<ArrowRight size={14} strokeWidth={2.5} />
											</span>
										</button>
									</Magnetic>
								</div>

								<p className='mt-8 text-center font-body text-sm text-ink-tertiary'>
									<Link
										to='/signin'
										className='hover:text-ink-primary transition-colors'
									>
										← Back to sign in
									</Link>
								</p>
							</form>
						)}
					</Formik>
				)}
			</div>
		</FormLayout>
	);
};

export default ResetPassword;
