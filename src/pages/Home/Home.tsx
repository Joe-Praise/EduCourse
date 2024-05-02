import { FC, useEffect } from 'react';
import { BigBanner, CentralizedHeaderText } from '../../components/shared';
import img from '../../assets/image/brain and ideas.jpg';
import { bannerTextType } from './homePageType';
import { Courses } from '../../components/Course';
import { Blogs } from '../../components/Blog';
import { TopCategories, Details } from '../../components/Home';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { getLandingPageAction } from '../../redux/actions/landingpageAction';
import TopInstrtuctors from '../../components/instructor/TopInstrtuctors';

const bannerTextDetails: bannerTextType[] = [
	{
		title: 'Learn new skills for the new year and beyond!',
		body: 'Dive into a realm of knowledge, creativity, and community engagement. Embrace the freedom to learn, connect, and thrive. Your journey to empowerment begins here – Join us on the path to a brighter digital future! ',
	},
];

const Home: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const landingPageData = useSelector(
		(state: RootState) => state.landingPage?.landingData.data
	);
	const courses = landingPageData?.courses;
	const instructors = landingPageData?.instructors;
	const categories = landingPageData?.categories;
	const blogs = landingPageData?.blogs;

	useEffect(() => {
		dispatch(getLandingPageAction());
	}, [dispatch]);

	console.log(landingPageData);
	return (
		<>
			<BigBanner img={img}>
				<CentralizedHeaderText
					title={bannerTextDetails[0].title}
					body={bannerTextDetails[0].body}
				/>
			</BigBanner>
			<div className='w-[83%] sm:w-10/12 lg:w-7/12 mx-auto'>
				<Courses courses={courses} />
				<TopCategories categories={categories} />
				<TopInstrtuctors instructors={instructors} />
				<Details />
				<Blogs blogs={blogs} />
			</div>
		</>
	);
};

export default Home;
