import { FC, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import { AppDispatchType, signUpAction } from '../../redux/actions/authAction';
import { EditorialInput } from '../Signin/EditorialInput';
import { Magnetic } from '../../patterns/Magnetic/Magnetic';

interface FormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const initialValues: FormValues = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const validationSchema = Yup.object({
	name: Yup.string().required('Please enter your name'),
	email: Yup.string()
		.required('Please enter your email')
		.email('Please enter a valid email address'),
	password: Yup.string()
		.required('Please enter your password')
		.min(8, 'Password must be at least 8 characters long'),
	confirmPassword: Yup.string()
		.required('Please confirm your password')
		.test('passwords-match', 'Passwords must match', function (value) {
			return this.parent.password === value;
		}),
});

const SignUpForm: FC = () => {
	const dispatch: AppDispatchType = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (values: FormValues) => {
		setLoading(true);
		await dispatch(signUpAction(values, navigate));
		setLoading(false);
	};

	return (
		<div className='w-full'>
			<span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
				Create account
			</span>

			<h1
				className='mt-4 font-display font-semibold text-ink-primary leading-[0.95] tracking-[-0.04em]'
				style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontVariationSettings: '"opsz" 144' }}
			>
				Start the{' '}
				<em
					className='font-display italic font-semibold text-clay-500'
					style={{ fontVariationSettings: '"opsz" 144' }}
				>
					work.
				</em>
			</h1>
			<p className='mt-4 font-body text-base text-ink-secondary leading-[1.55]'>
				No application form, no waiting list. Watch the first lesson on us, then decide.
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
							name='name'
							type='text'
							label='Full name'
							autoComplete='name'
							required
							value={values.name}
							onChange={handleChange}
							onBlur={handleBlur}
							error={errors.name}
							touched={touched.name}
						/>
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
							label='Confirm password'
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
									<span>{loading ? 'Creating account…' : 'Create account'}</span>
									<span className='inline-grid place-items-center h-9 w-9 rounded-full bg-ink-primary text-bg-base transition-transform duration-base ease-out-quart group-hover:translate-x-0.5'>
										<ArrowRight size={14} strokeWidth={2.5} />
									</span>
								</button>
							</Magnetic>
						</div>

						<p className='mt-6 font-body text-2xs text-ink-tertiary text-center leading-[1.6]'>
							By creating an account you agree to our{' '}
							<Link to='/' className='text-ink-secondary hover:text-ink-primary underline-offset-2 hover:underline transition-colors'>
								Terms
							</Link>{' '}
							and{' '}
							<Link to='/' className='text-ink-secondary hover:text-ink-primary underline-offset-2 hover:underline transition-colors'>
								Privacy Policy
							</Link>
							.
						</p>

						<p className='mt-6 font-body text-sm text-ink-tertiary text-center'>
							Already have an account?{' '}
							<Link
								to='/signin'
								className='text-clay-400 hover:text-clay-500 underline-offset-[6px] hover:underline transition-colors'
							>
								Sign in
							</Link>
						</p>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default SignUpForm;
