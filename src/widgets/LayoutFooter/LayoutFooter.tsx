import { FC } from 'react';
import LinksList from './UnorderedLinksList';
import { linkType } from '../LayoutHeader/navigationType';
import Logo from '../../components/shared/Logo';
import { contactUs } from './LayoutFooterModels';
import SocialMedia, { socialMediaType } from './SocialMedia';

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

const socials: socialMediaType[] = [
	{
		platform: 'Facebook',
		url: 'www.facebook.com',
	},
	{
		platform: 'X',
		url: 'www.twitter.com',
	},
	{
		platform: 'Pintrest',
		url: 'www.pintrest.com',
	},
	{
		platform: 'Instagram',
		url: 'www.instgram.com',
	},
	{
		platform: 'YouTube',
		url: 'www.instsgram.com',
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
							{socials?.map((el, index) => (
								<SocialMedia key={index} platform={el.platform} url={el.url} />
							))}
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default LayoutFooter;
