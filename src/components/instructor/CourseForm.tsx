import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import { CourseFormPayload } from '../../redux/api/instructorDashboardApi';
import {
  createCourseAction,
  updateCourseAction,
  getEditingCourseAction,
  clearEditingCourseAction,
} from '../../redux/actions/instructorDashboardAction';
import { getCategoryAction } from '../../redux/actions/categoryAction';
import InputField from '../shared/InputField';
import RichTextEditor from '../shared/RichTextEditor';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const validationSchema = Yup.object({
  title: Yup.string().min(10, 'Min 10 characters').max(200, 'Max 200 characters').required('Title is required'),
  description: Yup.string().required('Description is required'),
  priceCategory: Yup.string().oneOf(['Free', 'Paid']).required('Price category is required'),
  price: Yup.number().when('priceCategory', {
    is: 'Paid',
    then: (s) => s.min(0, 'Price must be 0 or more').required('Price is required for paid courses'),
    otherwise: (s) => s.optional(),
  }),
  level: Yup.string().required('Level is required'),
  category: Yup.string().required('Category is required'),
  duration: Yup.string().required('Duration is required'),
});

interface Props {
  courseId?: string;
}

const CourseForm = ({ courseId }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = !!courseId;

  const { categories } = useSelector((state: RootState) => state.category);
  const { editingCourse, loading } = useSelector((state: RootState) => state.instructorDashboard);

  useEffect(() => {
    dispatch(getCategoryAction({ page: '1', limit: '100' }, 'course'));
    if (isEdit && courseId) {
      dispatch(getEditingCourseAction(courseId));
    }
    return () => {
      dispatch(clearEditingCourseAction());
    };
  }, [dispatch, courseId, isEdit]);

  const initialValues: CourseFormPayload = {
    title: editingCourse?.title ?? '',
    description: editingCourse?.description ?? '',
    priceCategory: editingCourse?.priceCategory ?? 'Free',
    price: editingCourse?.price ?? 0,
    level: editingCourse?.level ?? '',
    category: editingCourse?.category ?? '',
    duration: editingCourse?.duration ?? '',
  };

  const formik = useFormik<CourseFormPayload>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = { ...values, price: values.priceCategory === 'Free' ? 0 : values.price };
      if (isEdit && courseId) {
        dispatch(updateCourseAction(courseId, payload, navigate));
      } else {
        dispatch(createCourseAction(payload, navigate));
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {/* Title */}
      <InputField
        label='Course Title'
        id='title'
        name='title'
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        errors={errors}
        touched={touched}
        requiredfield='true'
        placeholder='e.g. Complete React Developer Bootcamp'
      />

      {/* Description */}
      <div>
        <label className='block text-sm font-medium text-secondary-dark mb-1'>
          Description <span className='text-red-500 text-xs'>*</span>
        </label>
        <RichTextEditor
          content={values.description}
          onChange={(html) => setFieldValue('description', html)}
          placeholder='Describe what students will learn...'
        />
        {errors.description && touched.description && (
          <p className='text-xs text-red-500 mt-1'>{errors.description}</p>
        )}
      </div>

      {/* Price category + Price */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='priceCategory' className='block text-sm font-medium text-secondary-dark mb-1'>
            Price Category <span className='text-red-500 text-xs'>*</span>
          </label>
          <select
            id='priceCategory'
            name='priceCategory'
            value={values.priceCategory}
            onChange={handleChange}
            onBlur={handleBlur}
            className='border border-gray-300 rounded w-full h-11 px-2 text-sm outline-none focus:border-primary-color'
          >
            <option value='Free'>Free</option>
            <option value='Paid'>Paid</option>
          </select>
          {errors.priceCategory && touched.priceCategory && (
            <p className='text-xs text-red-500 mt-1'>{errors.priceCategory}</p>
          )}
        </div>

        {values.priceCategory === 'Paid' && (
          <InputField
            label='Price ($)'
            id='price'
            name='price'
            type='number'
            min={0}
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors}
            touched={touched}
            requiredfield='true'
          />
        )}
      </div>

      {/* Level + Category */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='level' className='block text-sm font-medium text-secondary-dark mb-1'>
            Level <span className='text-red-500 text-xs'>*</span>
          </label>
          <select
            id='level'
            name='level'
            value={values.level}
            onChange={handleChange}
            onBlur={handleBlur}
            className='border border-gray-300 rounded w-full h-11 px-2 text-sm outline-none focus:border-primary-color'
          >
            <option value=''>Select level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {errors.level && touched.level && (
            <p className='text-xs text-red-500 mt-1'>{errors.level}</p>
          )}
        </div>

        <div>
          <label htmlFor='category' className='block text-sm font-medium text-secondary-dark mb-1'>
            Category <span className='text-red-500 text-xs'>*</span>
          </label>
          <select
            id='category'
            name='category'
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className='border border-gray-300 rounded w-full h-11 px-2 text-sm outline-none focus:border-primary-color'
          >
            <option value=''>Select category</option>
            {categories.map((cat: { _id: string; name: string }) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && touched.category && (
            <p className='text-xs text-red-500 mt-1'>{errors.category}</p>
          )}
        </div>
      </div>

      {/* Duration */}
      <InputField
        label='Duration'
        id='duration'
        name='duration'
        value={values.duration}
        onChange={handleChange}
        onBlur={handleBlur}
        errors={errors}
        touched={touched}
        requiredfield='true'
        placeholder='e.g. 12 hours'
      />

      {/* Actions */}
      <div className='flex items-center gap-3 pt-2'>
        <button
          type='submit'
          disabled={loading}
          className='px-6 py-2.5 rounded-lg bg-primary-color text-white text-sm font-medium hover:bg-effect-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
        >
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Course'}
        </button>
        <button
          type='button'
          onClick={() => navigate('/instructor/dashboard')}
          className='px-6 py-2.5 rounded-lg border border-gray-300 text-secondary-dark text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
