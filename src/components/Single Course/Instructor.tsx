import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { FaFile } from 'react-icons/fa6';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import useFormatText from '../../hooks/UseFormatText';
import SocialMedia from '../../widgets/SocialMedia';
import { imgSrc, TRANSFORMS } from '../../util/helperFunctions/cloudinary';
import { resolveInstructor } from '../../util/helperFunctions/instructorDisplay';
import { Badge } from '../../ui';

export interface InstructorType {
	_id: string;
	// Optional — YouTube-imported instructors have no linked platform user.
	userId?: UserID;
	links: LinkType[];
	__v?: number;
	description: string;
	source?: 'user' | 'youtube';
	channelName?: string;
	channelThumbnailUrl?: string;
	channelUrl?: string;
	subscriberCount?: number;
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
			{instructors?.map((el, index) => {
				const display = resolveInstructor(el);
				return (
					<div key={`${index}_instructors`} className='mb-0'>
						<div className='md:flex gap-3'>
							<div>
								<figure className='w-full h-[300px] md:w-full md:h-[200px]'>
									<Link to={display.profilePath}>
										<img
											src={imgSrc(display.photo, '/img/', TRANSFORMS.avatarSm)}
											alt={display.name}
											className='h-full w-full rounded-lg object-cover bg-bg-raised'
										/>
									</Link>
								</figure>

								<div className='hidden md:block'>
									<div className='my-3'>
										{display.isYouTube ? (
											<div className='flex items-center gap-1 text-ink-secondary'>
												<FaGraduationCap />
												<span>
													{display.subscriberCount
														? `${display.subscriberCount.toLocaleString()} subscribers`
														: 'YouTube creator'}
												</span>
											</div>
										) : (
											<>
												<div className='flex items-center gap-1'>
													<FaGraduationCap />
													<span>30 students</span>
												</div>
												<div className='flex items-center gap-1'>
													<FaFile />
													<span>20 courses</span>
												</div>
											</>
										)}
									</div>

									{display.isYouTube && display.channelUrl ? (
										<a
											href={display.channelUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='inline-flex items-center gap-1 text-clay-400 hover:text-clay-500 transition-colors text-sm'
										>
											YouTube channel <ArrowUpRight size={13} strokeWidth={2} />
										</a>
									) : (
										<div className='flex items-center mt-0'>
											<h2>Follow:</h2>
											<ul>
												<li className='flex gap-2 py-1'>
													{el?.links?.map((socials, i) => (
														<SocialMedia
															platform={socials.platform}
															url={socials.url}
															key={socials._id + i}
														/>
													))}
												</li>
											</ul>
										</div>
									)}
								</div>
							</div>
							<div className='my-2 md:my-0'>
								<div className='flex items-center gap-2 flex-wrap'>
									<Link to={display.profilePath}>
										<h1 className='hover:text-clay-500 transition-colors'>{display.name}</h1>
									</Link>
									{display.isYouTube && (
										<Badge tone='info' size='sm'>
											<Sparkles size={11} strokeWidth={2} className='mr-1 inline -mt-0.5' />
											AI-Compiled
										</Badge>
									)}
								</div>
								{formatText(display.bio).map((line, i) => (
									<p key={i} className='mt-3'>
										{line}
									</p>
								))}

								<div className='block md:hidden'>
									<div className='my-3'>
										{display.isYouTube ? (
											<div className='flex items-center gap-1 text-ink-secondary'>
												<FaGraduationCap />
												<span>
													{display.subscriberCount
														? `${display.subscriberCount.toLocaleString()} subscribers`
														: 'YouTube creator'}
												</span>
											</div>
										) : (
											<>
												<div className='flex items-center gap-1'>
													<FaGraduationCap />
													<span>150 students</span>
												</div>
												<div className='flex items-center gap-1'>
													<FaFile />
													<span>20 courses</span>
												</div>
											</>
										)}
									</div>

									{!display.isYouTube && (
										<div className='flex items-center mt-0'>
											<h2>Follow:</h2>
											<ul>
												<li className='flex gap-2 py-1'>
													{el?.links?.map((socials, i) => (
														<SocialMedia
															platform={socials.platform}
															url={socials.url}
															key={socials._id + i}
														/>
													))}
												</li>
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</section>
	);
};

export default Instructor;
