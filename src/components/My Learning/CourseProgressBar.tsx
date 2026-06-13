import { useEffect, useState } from 'react';
import { Line } from 'rc-progress';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { getProgressSummaryApi } from '../../redux/api/enrollmentApi';

interface CourseProgressBarProps {
  courseId: string;
}

const CourseProgressBar = ({ courseId }: CourseProgressBarProps) => {
  const [percent, setPercent] = useState<number | null>(null);
  const userId: string = useSelector((state: RootState) => state.user.userObj?._id) ?? '';

  useEffect(() => {
    if (!userId || !courseId) return;
    getProgressSummaryApi(userId, courseId).then((res) => {
      if (res?.data?.completionPercentage !== undefined) {
        setPercent(res.data.completionPercentage);
      }
    });
  }, [userId, courseId]);

  if (percent === null) return null;

  return (
    <div className='px-3 pb-2'>
      <div className='flex items-center justify-between text-xs text-gray-500 mb-0.5'>
        <span>{percent === 100 ? 'Completed' : 'In progress'}</span>
        <span>{percent}%</span>
      </div>
      <Line
        percent={percent}
        strokeWidth={3}
        trailWidth={3}
        strokeColor='#49A8D0'
        trailColor='#E5E7EB'
      />
    </div>
  );
};

export default CourseProgressBar;
