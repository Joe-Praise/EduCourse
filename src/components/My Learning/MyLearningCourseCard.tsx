import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { CourseCard, type CourseCardData } from '../../features/course';
import { getProgressSummaryApi } from '../../redux/api/enrollmentApi';

/**
 * A My-Learning grid item: an enrolled CourseCard that
 *  1. links straight to the lecture player (`/courses/:slug/lecture/:courseId`)
 *     instead of the course sales page, and
 *  2. shows live completion progress fetched per course.
 */
interface MyLearningCourseCardProps {
	course: CourseCardData & {
		_id?: string;
		courseId?: { _id: string } | string;
	};
	priority?: boolean;
}

const resolveCourseId = (card: MyLearningCourseCardProps['course']): string => {
	if (card._id) return card._id;
	if (typeof card.courseId === 'object') return card.courseId?._id ?? '';
	return card.courseId ?? '';
};

const MyLearningCourseCard = ({ course, priority }: MyLearningCourseCardProps) => {
	const userId = useSelector((state: RootState) => state.user.userObj?._id) ?? '';
	const courseId = resolveCourseId(course);
	const [percent, setPercent] = useState<number | null>(null);

	useEffect(() => {
		let active = true;
		if (!userId || !courseId) return;
		getProgressSummaryApi(userId, courseId).then((res) => {
			if (active && typeof res?.data?.completionPercentage === 'number') {
				setPercent(res.data.completionPercentage);
			}
		});
		return () => {
			active = false;
		};
	}, [userId, courseId]);

	const lecturePath = course.slug
		? `/courses/${course.slug}/lecture/${courseId}`
		: undefined;

	const progress = percent ?? 0;
	const label =
		percent === null
			? 'View progress'
			: progress >= 100
				? 'Completed · revisit'
				: progress === 0
					? 'Start learning'
					: `${Math.round(progress)}% complete`;

	return (
		<CourseCard
			course={course}
			variant='enrolled'
			to={lecturePath}
			progressPercent={progress}
			progressLabel={label}
			priority={priority}
		/>
	);
};

export default MyLearningCourseCard;
