import Breadcrumbs from '../../util/Breadcrumbs';
import img from '../../assets/image/card5.jpg';
import Button from '../Button';
import { IoBarChart } from 'react-icons/io5';
import { FaFile } from 'react-icons/fa6';
import { FaGraduationCap } from 'react-icons/fa';
import { BsQuestionSquareFill } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface headerbadge {
	title: string;
	total: string;
	icon: IconType;
}

const HeaderContainer = () => {
	const handleStartCourse = () => {
		console.log('Start course initiated!');
	};

	const dataDisplay: headerbadge[] = [
		{
			title: 'Students',
			total: '150',
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			icon: FaGraduationCap,
		},
		{
			title: 'All levels',
			total: '',
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			icon: IoBarChart,
		},
		{
			title: 'Lessons',
			total: '20',
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			icon: FaFile,
		},
		{
			title: 'Quizzes' || 'Quiz',
			total: '3',
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			icon: BsQuestionSquareFill,
		},
	];
	return (
		<section className='bg-black text-white p-2'>
			<div className='layoutWidth flex md:justify-between relative flex-wrap gap-3 md:gap-0'>
				<div className='basis-full sm:basis-auto '>
					<h3 className='mb-4'>
						<Breadcrumbs />
					</h3>
					<div className='my-1'>
						<div className='text-sm flex gap-2 items-center'>
							<span className='p-2 bg-tertiary-color rounded-md text-black'>
								<span className='text-xs font-bold'>Programming</span>
							</span>
							<span>by Joe Praise</span>
						</div>
					</div>

					<h1 className='my-2'>React and Redux master class</h1>

					<div className='flex items-center gap-3 my-1 flex-wrap'>
						{dataDisplay.map((el, idx) => {
							return (
								<div
									key={idx}
									className='flex basis-1/3 md:basis-auto items-center gap-1'
								>
									<el.icon className='fill-effect-active' />
									{el.total.length > 0 ? <span>{el.total}</span> : null}
									<span>{el.title}</span>
								</div>
							);
						})}
					</div>
				</div>
				<div className='md:absolute md:right-0 md:top-5'>
					<figure className='md:w-56 md:h-44 md:bg-white rounded-t-lg'>
						<img
							src={img}
							alt='course cover'
							className='w-full h-full object-cover rounded-t-lg'
						/>
						<figcaption className='flex items-center justify-between p-2 md:shadow-lg md:border text-white md:text-black'>
							<p>
								<span className='line-through text-white  md:text-secondary-light'>
									{/* ${props.price} */}
									$400
								</span>{' '}
								<span className='text-green-500'>Free</span>
							</p>

							<Button
								className={
									' border text-white md:text-black p-2 rounded-full hover:text-effect-hover hover:border-effect-hover active:bg-effect-active active:text-white'
								}
								value={'Start now'}
								onClick={handleStartCourse}
							/>
						</figcaption>
					</figure>
				</div>
			</div>
		</section>
	);
};

export default HeaderContainer;
