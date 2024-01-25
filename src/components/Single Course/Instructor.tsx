import { socialMediaLinksIcons } from '../../widgets/LayoutFooter/models/LayoutFooterModels';
import SocialMedia from '../../widgets/LayoutFooter/ui/SocialMedia';
import { FaFacebookF, FaGraduationCap, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaPinterestP } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { FaFile } from 'react-icons/fa6';
import img from '../../assets/image/card2.jpg';

const socials: socialMediaLinksIcons[] = [
	{
		id: 1,
		path: '/facebook',
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		Icon: FaFacebookF,
	},
	{
		id: 2,
		path: '/twitter',
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		Icon: FaXTwitter,
	},
	{
		id: 3,
		path: '/pintrest',
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		Icon: FaPinterestP,
	},
	{
		id: 4,
		path: '/instagram',
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		Icon: AiFillInstagram,
	},
	{
		id: 5,
		path: '/youTube',
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		Icon: FaYoutube,
	},
];

const Instructor = () => {
	return (
		<div>
			<div className='md:flex gap-3'>
				{/* <div className='basis-[80%]'> */}
				<figure className='w-full md:w-[600px] h-40'>
					<img
						src={img}
						alt={'joe praise profile pic'}
						className='h-full w-full rounded-lg object-cover'
					/>
				</figure>
				{/* </div> */}
				<div className='my-2 md:my-0'>
					<h1>Joe Praise</h1>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores et
						officia molestias ipsum ad perferendis quam soluta provident.
						Repellendus, ea! Lorem ipsum dolor, sit amet consectetur adipisicing
						elit. Delectus sequi tempora quibusdam corrupti, rerum vel ipsam
						quidem saepe voluptate rem.
					</p>
					<div className='flex items-center gap-1'>
						<FaGraduationCap />
						<span>150 students</span>
					</div>
					<div className='flex items-center gap-1'>
						<FaFile />
						<span>20 courses</span>
					</div>
				</div>
			</div>
			<div className='flex items-center mt-2'>
				<h2>Follow:</h2>
				<ul>
					<li className='flex gap-2 py-1'>
						{socials?.map((el) => (
							<SocialMedia Icon={el.Icon} path={el.path} key={el.id} />
						))}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Instructor;
