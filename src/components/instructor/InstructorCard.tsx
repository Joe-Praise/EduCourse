import { FaGraduationCap } from 'react-icons/fa';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import config from '../../../config';

interface Iprop {
	img: string;
	name: string;
	expertise: string;
	noOfStudents: string;
	noOfCourses: string;
}

const InstructorCard = (props: Iprop) => {
	const { img, name, expertise, noOfStudents, noOfCourses } = props;
	return (
		<Link
			to={''}
			className='w-52 flex flex-col items-center justify-center m-2 p-1 hover:scale-105 duration-150'
		>
			<figure className='block w-44 h-44 rounded-full'>
				<img
					src={`${config.baseUrl}/img/${img}`}
					alt={`Instructor ${name}'s cover image`}
					loading='lazy'
					className='w-full h-full rounded-full'
				/>
			</figure>
			<figcaption className='w-full text-center mt-2'>
				<div className='my-2'>
					<p className='font-bold'>{name}</p>
					<span className='text-xs'>{expertise}</span>
				</div>

				<div className='w-11/12 mx-auto py-3 flex justify-between gap-2 text-xs border-t-2'>
					<div className='flex basis-[45%] md:basis-auto items-center gap-1'>
						<FaGraduationCap className='fill-effect-active' />
						<span>{noOfStudents}</span>
						<span>Students</span>
						{/* {el.total.length > 0 ? <span>{el.total}</span> : null}
						<span>{el.title}</span> */}
					</div>
					<div className='flex basis-[45%] md:basis-auto items-center gap-1'>
						<FaRegCirclePlay className='fill-effect-active' />
						<span>{noOfCourses}</span>
						<span>Courses</span>
						{/* {el.total.length > 0 ? <span>{el.total}</span> : null}
						<span>{el.title}</span> */}
					</div>
				</div>
			</figcaption>
		</Link>
	);
};

export default InstructorCard;
