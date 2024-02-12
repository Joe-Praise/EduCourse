import SocialMedia from '../../widgets/LayoutFooter/SocialMedia';
import { FaGraduationCap } from 'react-icons/fa';
import { FaFile } from 'react-icons/fa6';
import { FC, Fragment } from 'react';
import config from '../../../config';

export interface InstructorType {
	_id: string;
	userId: UserID;
	links: LinkType[];
	__v: number;
	description: string;
}

export interface UserID {
	_id: string;
	name: string;
	email: string;
	role: string[];
	photo: string;
}

export interface LinkType {
	_id: string;
	userId: string;
	platform: string;
	url: string;
}

const Instructor: FC<{ instructors: InstructorType[] }> = ({ instructors }) => {
	return (
		<div>
			{instructors?.map((el) => (
				<Fragment key={el._id}>
					<div className='md:flex gap-3'>
						<figure className='w-full md:w-[150px] h-40'>
							<img
								src={`${config?.baseUrl}/img/${el?.userId?.photo}`}
								alt={`${el?.userId?.name}'s display image`}
								className='h-full w-full rounded-lg object-cover'
							/>
						</figure>
						<div className='my-2 md:my-0'>
							<h1>{el?.userId?.name}</h1>
							<p>{el?.description}</p>
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
								{/* TODO: Handle links on backend to be actual links */}
								{el?.links?.map((socials) => {
									console.log(typeof socials);
									return (
										<SocialMedia
											platform={socials.platform}
											url={socials.url}
											key={socials._id}
										/>
									);
								})}
							</li>
						</ul>
					</div>
				</Fragment>
			))}
		</div>
	);
};

export default Instructor;
