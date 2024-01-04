import { FC } from 'react';
import BigBanner from '../../../components/BigBanner';
import img from '../../../assets/image/brain and ideas.jpg';
import CentralizedHeaderText from '../../../components/CentralizedHeaderText';
import { bannerTextType } from '../model/homePageType';
import Courses from '../../../components/Home/Courses';

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
			<div className='w-11/12 sm:w-10/12 lg:w-8/12 mx-auto'>
				<Courses />
			</div>
		</>
	);
};

export default Home;
