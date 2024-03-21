import { FC } from 'react';
import { BigBanner, CentralizedHeaderText } from '../../components/shared';
import img from '../../assets/image/brain and ideas.jpg';
import { bannerTextType } from './homePageType';
import { Courses } from '../../components/Course';
import { Blogs } from '../../components/Blog';
import { TopCategories, Details } from '../../components/Home';

const bannerTextDetails: bannerTextType[] = [
	{
		title: 'Learn new skills for the new year and beyond!',
		body: 'Dive into a realm of knowledge, creativity, and community engagement. Embrace the freedom to learn, connect, and thrive. Your journey to empowerment begins here – Join us on the path to a brighter digital future! ',
	},
];

const Home: FC = () => {
	return (
		<>
			<BigBanner img={img}>
				<CentralizedHeaderText
					title={bannerTextDetails[0].title}
					body={bannerTextDetails[0].body}
				/>
			</BigBanner>
			<div className='w-[83%] sm:w-10/12 lg:w-7/12 mx-auto'>
				<TopCategories />
				<Courses />
				<Details />
				<Blogs />
			</div>
		</>
	);
};

export default Home;
