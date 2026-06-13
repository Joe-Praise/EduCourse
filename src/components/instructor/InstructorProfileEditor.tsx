import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import { updateInstructorProfileAction } from '../../redux/actions/instructorDashboardAction';
import { RichTextEditor } from '../shared';
import { Button } from '../../ui';

interface InstructorProfileEditorProps {
  instructorId: string;
  initialTitle?: string;
  initialExpertise?: string;
  initialDescription?: string;
}

const InstructorProfileEditor = ({
  instructorId: _instructorId,
  initialTitle = '',
  initialExpertise = '',
  initialDescription = '',
}: InstructorProfileEditorProps) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.instructorDashboard.loading);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initialTitle,
      expertise: initialExpertise,
      description: initialDescription,
    },
    onSubmit: (values) => {
      dispatch(updateInstructorProfileAction(values));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='space-y-6'>
      <div className='flex flex-col gap-1.5'>
        <label htmlFor='title' className='font-body font-medium text-sm text-ink-secondary'>
          Title
        </label>
        <input
          id='title'
          name='title'
          type='text'
          value={formik.values.title}
          onChange={formik.handleChange}
          placeholder='e.g. Senior Software Engineer'
          className='w-full h-11 rounded-card border border-line-base bg-bg-overlay/40 px-3.5 py-2 font-body text-sm text-ink-primary placeholder-ink-tertiary outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-colors'
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <label htmlFor='expertise' className='font-body font-medium text-sm text-ink-secondary'>
          Expertise
        </label>
        <input
          id='expertise'
          name='expertise'
          type='text'
          value={formik.values.expertise}
          onChange={formik.handleChange}
          placeholder='e.g. Building Safety, Structural Engineering'
          className='w-full h-11 rounded-card border border-line-base bg-bg-overlay/40 px-3.5 py-2 font-body text-sm text-ink-primary placeholder-ink-tertiary outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-colors'
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='font-body font-medium text-sm text-ink-secondary'>Bio</label>
        <RichTextEditor
          content={formik.values.description}
          onChange={(html) => formik.setFieldValue('description', html)}
          placeholder='Tell students about yourself…'
        />
      </div>

      <Button type='submit' variant='primary' size='md' loading={loading}>
        Save changes
      </Button>
    </form>
  );
};

export default InstructorProfileEditor;
