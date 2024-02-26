import { FC, useState } from 'react';
import Button from '../shared/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from '../shared/InputField';
import { AppDispatchType, signInAction } from '../../redux/actions/authAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const initialValues = {
	email: '',
	password: '',
};

type InitialValues = ReturnType<() => typeof initialValues>;

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
	const [loading, setLodaing] = useState(false);
	const navigate = useNavigate();

	const onSubmit = async (values: InitialValues) => {
		setLodaing(true);
		await dispatch(signInAction(values, navigate));
		setLodaing(false);
	};

	SigninForm.propTypes = {
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
						// resetForm,
					} = props;
					return (
						<form className=''>
							<InputField
								name='email'
								type='email'
								id='email'
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
								label='password'
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								errors={errors}
								touched={touched}
								requiredfield={'true'}
							/>
							<div>
								<Button
									value='Sign in'
									className='border p-2 border-color rounded-md bg-primary-color hover:bg-effect-hover active:bg-effect-active text-white transition-all outline-none'
									size='w-full h-14'
									onClick={() => {
										handleSubmit();
										// if (!errors) {
										// 	setTimeout(() => resetForm(), 2000);
										// }
									}}
									isLoading={loading}
								/>
							</div>

							<div className='flex justify-between items-center flex-wrap mt-5 gap-3 sm:gap-0'>
								<Button href='/signup' className='underline'>
									Dont&apos;t an account? {'>'} Sign up
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

export default SigninForm;
