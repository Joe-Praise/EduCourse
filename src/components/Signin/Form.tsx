import { FC, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { AppDispatchType, signInAction } from '../../redux/actions/authAction';
import { EditorialInput } from './EditorialInput';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';

interface FormValues {
	email: string;
	password: string;
}

const initialValues: FormValues = { email: '', password: '' };

const validationSchema = Yup.object({
	email: Yup.string()
		.required('Please enter your email')
		.email('Please enter a valid email address'),
	password: Yup.string()
		.required('Please enter your password')
		.min(8, 'Password must be at least 8 characters long'),
});

const SigninForm: FC = () => {
	const dispatch: AppDispatchType = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (values: FormValues) => {
		setLoading(true);
		await dispatch(signInAction(values, navigate));
		setLoading(false);
	};

	return (
		<div className='w-full'>
			{/* Eyebrow */}
			<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
				Sign in
			</span>

			{/* Headline */}
			<h1
				className='mt-4 font-display font-semibold text-ink-primary leading-[0.95] tracking-[-0.04em]'
				style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontVariationSettings: '"opsz" 144' }}
			>
				Welcome{' '}
				<em
					className='font-display italic font-semibold text-clay-500'
					style={{ fontVariationSettings: '"opsz" 144' }}
				>
					back.
				</em>
			</h1>
			<p className='mt-4 font-body text-base text-ink-secondary leading-[1.55]'>
				Pick up where you left off — your courses, notes, and streak are waiting.
			</p>

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
						<EditorialInput
							name='password'
							type='password'
							label='Password'
							autoComplete='current-password'
							required
							value={values.password}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.password}
							touched={touched.password}
						/>

						<div className='flex justify-end -mt-2 mb-3'>
							<Link
								to='/forgot-password'
								className='font-body text-xs text-ink-tertiary hover:text-clay-400 transition-colors'
							>
								Forgot password?
							</Link>
						</div>

						<div className='pt-4'>
							<Magnetic strength={0.18}>
								<button
									type='submit'
									disabled={loading}
									data-cursor='grow'
									className='group inline-flex w-full items-center justify-center gap-3 h-14 px-6 rounded-pill bg-clay-500 hover:bg-clay-600 text-ink-primary font-body font-medium text-sm transition-colors duration-base disabled:opacity-60 disabled:cursor-not-allowed'
								>
									<span>{loading ? 'Signing in…' : 'Sign in'}</span>
									<span className='inline-grid place-items-center h-9 w-9 rounded-full bg-ink-primary text-bg-base transition-transform duration-base ease-out-quart group-hover:translate-x-0.5'>
										<ArrowRight size={14} strokeWidth={2.5} />
									</span>
								</button>
							</Magnetic>
						</div>

						<p className='mt-8 font-body text-sm text-ink-tertiary text-center'>
							New to EduCourse?{' '}
							<Link
								to='/signup'
								className='text-clay-400 hover:text-clay-500 underline-offset-[6px] hover:underline transition-colors'
							>
								Create an account
							</Link>
						</p>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default SigninForm;
