import { useNavigate } from 'react-router-dom';
import { InstructorCourseType } from '../../redux/api/instructorDashboardApi';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { cn } from '../../lib/cn';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-bg-overlay text-ink-tertiary border border-line-base',
  review: 'bg-signal-warning/15 text-signal-warning border border-signal-warning/30',
  published: 'bg-signal-success/15 text-signal-success border border-signal-success/30',
  archived: 'bg-signal-danger/15 text-signal-danger border border-signal-danger/30',
};

interface InstructorCourseRowProps {
  course: InstructorCourseType;
  onSubmitReview: (courseId: string) => void;
}

const InstructorCourseRow = ({ course, onSubmitReview }: InstructorCourseRowProps) => {
  const navigate = useNavigate();
  const statusStyle = STATUS_STYLES[course.publishedStatus] ?? STATUS_STYLES.draft;

  return (
    <div className='group flex items-center gap-4 p-4 sm:p-5 rounded-card border border-line-subtle bg-bg-raised hover:border-line-base hover:bg-bg-overlay/40 transition-[border-color,background-color] duration-base ease-out-quart'>
      {/* Thumbnail */}
      <div className='w-20 h-14 rounded-md overflow-hidden flex-shrink-0 bg-bg-sunken'>
        {course.imageCover ? (
          <img
            src={imgSrc(course.imageCover, '/course/', TRANSFORMS.courseCoverCard)}
            alt={course.title}
            className='w-full h-full object-cover'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-clay-500/25 via-sienna-500/15 to-bg-sunken' />
        )}
      </div>

      {/* Title + status */}
      <div className='flex-1 min-w-0'>
        <p className='font-display font-semibold text-ink-primary truncate text-base tracking-[-0.01em]'>
          {course.title}
        </p>
        <span
          className={cn(
            'inline-block mt-1.5 font-mono text-2xs uppercase tracking-[0.16em] px-2 py-0.5 rounded-pill',
            statusStyle,
          )}
        >
          {course.publishedStatus}
        </span>
      </div>

      {/* Stats */}
      <div className='hidden md:flex items-center gap-8 flex-shrink-0'>
        <div className='text-center'>
          <p className='font-display font-semibold text-lg text-ink-primary tabular-nums leading-none'>
            {course.studentsQuantity ?? 0}
          </p>
          <p className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary mt-1'>
            Students
          </p>
        </div>
        <div className='text-center'>
          <p className='font-display font-semibold text-lg text-ink-primary tabular-nums leading-none'>
            {course.ratingsAverage?.toFixed(1) ?? '—'}
          </p>
          <p className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary mt-1'>
            Rating
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2 flex-shrink-0'>
        <button
          type='button'
          onClick={() => navigate(`/instructor/courses/${course._id}/edit`)}
          className='font-body text-xs px-3 py-1.5 rounded-pill border border-line-base text-ink-primary hover:border-line-strong hover:bg-bg-overlay/60 transition-colors'
        >
          Edit
        </button>
        {course.publishedStatus === 'draft' && (
          <button
            type='button'
            onClick={() => onSubmitReview(course._id)}
            className='font-body text-xs px-3 py-1.5 rounded-pill bg-clay-500 text-white font-medium hover:bg-clay-600 transition-colors'
          >
            Submit for review
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorCourseRow;
