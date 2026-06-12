import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getLandingPageAction } from '../../redux/actions/landingpageAction';
import { getPlatformStatsAction } from '../../redux/actions/platformAction';
import { Preloader } from '../../patterns/Preloader/Preloader';
import {
	Hero,
	TrustMarquee,
	CategoryBento,
	FeaturedCoursesRail,
	InstructorSpotlightGrid,
	StatsBand,
	FinalCTA,
	PinnedStory,
} from '../../features/home';
import type { CourseCardData } from '../../features/course/CourseCard';

const Home: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const landingPageData = useSelector(
		(state: RootState) => state.landingPage?.landingData.data,
	);
	const platformStats = useSelector((state: RootState) => state.platform?.stats);

	useEffect(() => {
		dispatch(getLandingPageAction());
		dispatch(getPlatformStatsAction());
	}, [dispatch]);

	const courses = (landingPageData?.courses ?? []) as unknown as ReadonlyArray<CourseCardData>;
	const categories = landingPageData?.categories;
	const instructors = landingPageData?.instructors;

	return (
		<>
			<Preloader wordmark='EduCourse' />
			<Hero courses={courses} />
			<TrustMarquee />
			<CategoryBento categories={categories} />

			{/* Three pinned editorial story sections — Learner, Instructor (light break), Team */}
			<PinnedStory
				persona='learner'
				eyebrow='For the person who finishes'
				headline='Built for the work, not the credential.'
				body='EduCourse is the antidote to the dabbling carousel. Pick a craft, watch real practitioners build, then build the same thing yourself.'
				imageSide='left'
			/>
			<PinnedStory
				persona='instructor'
				eyebrow='For the person who built it'
				headline='Teach the thing you actually made.'
				body='We pay 80% to creators. We give you the tools to publish a course in an afternoon and the room to keep iterating it for a decade.'
				imageSide='right'
				tone='paper'
			/>
			<PinnedStory
				persona='team'
				eyebrow='For the group'
				headline='Bring it back to the team.'
				body='Roll EduCourse out to engineering, design, ops. One bill. Real outcomes. Quarterly cohort reports.'
				imageSide='left'
			/>

			<FeaturedCoursesRail courses={courses} />
			<InstructorSpotlightGrid instructors={instructors} />
			<StatsBand
				totalStudents={platformStats?.totalStudents}
				totalPaidToCreators={platformStats?.totalPaidToCreators}
				totalLessons={platformStats?.totalLessons}
			/>
			<FinalCTA />
		</>
	);
};

export default Home;
