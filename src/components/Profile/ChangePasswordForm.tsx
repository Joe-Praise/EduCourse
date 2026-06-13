import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { updatePasswordAction } from '../../redux/actions/userAction';
import InputField from '../shared/InputField';
import { Button } from '../../ui';

const ChangePasswordForm = () => {
  const dispatch: AppDispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(8, 'New password must be at least 8 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await dispatch(
        updatePasswordAction({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
      );
      setSubmitting(false);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='space-y-5'>
      <header>
        <span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
          Security
        </span>
        <h3
          className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
          style={{ fontVariationSettings: '"opsz" 32' }}
        >
          Change your password.
        </h3>
      </header>

      <InputField
        id='currentPassword'
        name='currentPassword'
        label='Current password'
        type='password'
        value={formik.values.currentPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors}
        touched={formik.touched}
        requiredfield='true'
      />

      <InputField
        id='newPassword'
        name='newPassword'
        label='New password'
        type='password'
        value={formik.values.newPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors}
        touched={formik.touched}
        requiredfield='true'
      />

      <InputField
        id='confirmPassword'
        name='confirmPassword'
        label='Confirm new password'
        type='password'
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors}
        touched={formik.touched}
        requiredfield='true'
      />

      <Button type='submit' variant='primary' size='md' loading={formik.isSubmitting}>
        Update password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
