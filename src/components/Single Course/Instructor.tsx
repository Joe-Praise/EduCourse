// import SocialMedia from '../../widgets/LayoutFooter/SocialMedia';
import { FaGraduationCap } from 'react-icons/fa';
import { FaFile } from 'react-icons/fa6';
import config from '../../../config';
import useFormatText from '../../hooks/UseFormatText';
import SocialMedia from '../../widgets/LayoutFooter/SocialMedia';

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

interface Iprop {
	instructors: InstructorType[];
}

const Instructor = (props: Iprop) => {
	const { instructors } = props;
	const { formatText } = useFormatText();
	return (
		<section>
			{instructors?.map((el, index) => (
				<div key={`${index}_instructors`} className='mb-0'>
					<div className='md:flex gap-3'>
						<div>
							<figure className='w-full  h-[300px] md:w-full md:h-[200px]'>
								<img
									src={`${config?.baseUrl}/img/${el?.userId?.photo}`}
									alt={`${el?.userId?.name}'s display image`}
									className='h-full w-full rounded-lg object-cover'
								/>
							</figure>

							<div className='hidden md:block'>
								<div className='my-3'>
									<div className='flex items-center gap-1'>
										<FaGraduationCap />
										<span>30 students</span>
									</div>
									<div className='flex items-center gap-1'>
										<FaFile />
										<span>20 courses</span>
									</div>
								</div>

								<div className='flex items-center mt-0'>
									<h2>Follow:</h2>
									<ul>
										<li className='flex gap-2 py-1'>
											{el?.links?.map((socials, index) => {
												return (
													<SocialMedia
														platform={socials.platform}
														url={socials.url}
														key={socials._id + index}
													/>
												);
											})}
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className='my-2 md:my-0'>
							<h1>{el?.userId?.name}</h1>
							{formatText(el?.description).map((el, index) => (
								<p key={index} className='mt-3'>
									{el}
								</p>
							))}

							<div className='block md:hidden'>
								<div className='my-3'>
									<div className='flex items-center gap-1'>
										<FaGraduationCap />
										<span>150 students</span>
									</div>
									<div className='flex items-center gap-1'>
										<FaFile />
										<span>20 courses</span>
									</div>
								</div>

								<div className='flex items-center mt-0'>
									<h2>Follow:</h2>
									<ul>
										<li className='flex gap-2 py-1'>
											{el?.links?.map((socials, index) => {
												return (
													<SocialMedia
														platform={socials.platform}
														url={socials.url}
														key={socials._id + index}
													/>
												);
											})}
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</section>
	);
};

export default Instructor;
