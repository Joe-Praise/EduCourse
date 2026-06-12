import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import { updateUser } from '../../redux/actions/userAction';
import InputField from '../shared/InputField';
import { Button } from '../../ui';

const ProfileInfoForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const userObj = useSelector((state: RootState) => state.user.userObj);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userObj?.name ?? '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .required('Name is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      dispatch(updateUser(formData));
      setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='space-y-5'>
      <header>
        <span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
          Personal info
        </span>
        <h3
          className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
          style={{ fontVariationSettings: '"opsz" 32' }}
        >
          Who you are.
        </h3>
      </header>

      <InputField
        id='name'
        name='name'
        label='Full name'
        type='text'
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors}
        touched={formik.touched}
        requiredfield='true'
      />

      <div className='flex flex-col gap-1.5'>
        <label className='font-body font-medium text-sm text-ink-secondary'>Email</label>
        <p className='rounded-card border border-line-subtle bg-bg-sunken w-full h-11 px-3.5 font-body text-sm text-ink-tertiary flex items-center'>
          {userObj?.email}
        </p>
        <span className='font-body text-xs text-ink-tertiary'>Email cannot be changed.</span>
      </div>

      <Button type='submit' variant='primary' size='md' loading={formik.isSubmitting}>
        Save changes
      </Button>
    </form>
  );
};

export default ProfileInfoForm;
