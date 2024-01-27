import { FC } from 'react';
import LinksList from './UnorderedLinksList';
import { linkType } from '../../LayoutHeader/model/navigationType';
import Logo from '../../../components/shared/Logo';
import { contactUs, socialMediaLinksIcons } from '../models/LayoutFooterModels';
import { FaFacebookF, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaPinterestP } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import SocialMedia from './SocialMedia';

const link1: linkType[] = [
	{
		id: 1,
		name: 'Home',
		path: '/',
	},
	{
		id: 2,
		name: 'Courses',
		path: '/courses',
	},
	{
		id: 3,
		name: 'Blog',
		path: '/blogs',
	},
	{
		id: 4,
		name: 'My learning',
		path: '/my-courses/learning',
	},
];

const link2: linkType[] = [
	{
		id: 1,
		name: 'Profile',
		path: '/profile',
	},
	{
		id: 2,
		name: 'Contact Us',
		path: '/contactus',
	},
	{
		id: 5,
		name: "FAQ's",
		path: '/faqs',
	},
];

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

const contacUsDetails: contactUs[] = [
	{
		id: 1,
		title: 'Address',
		description: '2000 New Design Str, Lorem Ipsum10, Ogun State, Nigeria',
	},
	{
		id: 2,
		title: 'Tel',
		description: '+(234) 8200-4566-7',
	},
	{
		id: 3,
		title: 'Mail',
		description: 'alimipraisejoe@gmail.com',
	},
];

const LayoutFooter: FC = () => {
	return (
		<div className='px-3 sm:px-0 py-4 bg-effect-active text-white'>
			<div className='flex sm:justify-between flex-wrap sm:w-11/12 sm:mx-auto pb-4'>
				<div className='basis-full sm:basis-[30%] mt-3'>
					<Logo />
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
						facilis porro pariatur iste suscipit quaerat repellendus molestiae
						amet vero veritatis, doloribus error reiciendis nisi corrupti
						temporibus ipsam. Non, rerum! Natus!
					</p>
				</div>
				<div className='mt-3 basis-[20%]'>
					<LinksList link={link1} />
				</div>
				<div className='mt-3 basis-[20%]'>
					<LinksList link={link2} />
				</div>
				<div className='mt-3 basis-full sm:basis-[20%]'>
					<ul>
						{contacUsDetails?.map((el) => (
							<li
								key={el.id}
								className='text-[0.9rem] font-exo font-[600] text-secondary-light text-white'
							>
								{el.title}: {el.description}
							</li>
						))}
						<li className='flex gap-2 py-1'>
							{socials?.map((el) => (
								<SocialMedia Icon={el.Icon} path={el.path} key={el.id} />
							))}
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default LayoutFooter;
