import { FC, useState } from 'react';
import Button from '../shared/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from '../shared/InputField';
import { AppDispatchType, signUpAction } from '../../redux/actions/authAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const initialValues = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

type InitialValues = ReturnType<() => typeof initialValues>;

const validationSchema = Yup.object({
	name: Yup.string().required('Please enter your name'),
	email: Yup.string()
		.required('Please enter your email')
		.email('Please enter a valid email address'),
	password: Yup.string()
		.required('Please enter your password')
		.min(8, 'Password must be at least 8 characters long'),
	confirmPassword: Yup.string().test(
		'passwords-match',
		'Passwords must match',
		function (value) {
			return this.parent.password === value;
		}
	),
});

const SignUpForm: FC = () => {
	const dispatch: AppDispatchType = useDispatch();
	const [loading, setLodaing] = useState(false);
	const navigate = useNavigate();

	const onSubmit = async (values: InitialValues) => {
		setLodaing(true);
		await dispatch(signUpAction(values, navigate));
		setLodaing(false);
	};

	// Inside your component
	SignUpForm.propTypes = {
		values: PropTypes.object.isRequired,
		handleChange: PropTypes.func.isRequired,
		handleBlur: PropTypes.func.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		errors: PropTypes.object.isRequired,
		touched: PropTypes.object.isRequired,
		resetForm: PropTypes.func.isRequired,
	};

	return (
		<section className='w-10/12 lg:w-1/2'>
			<div className='mb-11'>
				<h1 className='text-center'>
					Welcome,
					<br /> we&apos;re happy to have you on board!
				</h1>
			</div>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{(props) => {
					const {
						values,
						handleChange,
						handleBlur,
						handleSubmit,
						errors,
						touched,
						resetForm,
					} = props;
					return (
						<form className=''>
							<InputField
								name='name'
								type='text'
								id='name'
								// placeholder='Enter your name'
								label='Name'
								value={values.name}
								onChange={handleChange}
								onBlur={handleBlur}
								errors={errors}
								touched={touched}
								requiredfield={'true'}
							/>
							<InputField
								name='email'
								type='email'
								id='email'
								// placeholder='Enter email'
								label='Email'
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								errors={errors}
								touched={touched}
								requiredfield={'true'}
							/>
							<InputField
								name='password'
								type='password'
								id='password'
								// placeholder='Enter your password'
								label='password'
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								errors={errors}
								touched={touched}
								requiredfield={'true'}
							/>
							<InputField
								name='confirmPassword'
								type='password'
								id='confirmPassword'
								// placeholder='Enter '
								label='Confirm Password'
								value={values.confirmPassword}
								onChange={handleChange}
								onBlur={handleBlur}
								errors={errors}
								touched={touched}
								requiredfield={'true'}
							/>

							<div>
								<Button
									value='Sign up'
									className='border p-2 border-color rounded-md bg-primary-color hover:bg-effect-hover active:bg-effect-active text-white transition-all outline-none'
									size='w-full h-14'
									onClick={() => {
										handleSubmit();
										if (!errors) {
											setTimeout(() => resetForm(), 2000);
										}
									}}
									isLoading={loading}
								/>
							</div>

							<div className='flex justify-between items-center flex-wrap mt-5 gap-3 sm:gap-0'>
								<Button href='/signin' className='underline'>
									Already have an account? {'>'} Sign in
								</Button>
								<Button href='/' className='underline'>
									Return to home page
								</Button>
							</div>
						</form>
					);
				}}
			</Formik>
		</section>
	);
};

export default SignUpForm;
