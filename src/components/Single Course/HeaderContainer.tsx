import Breadcrumbs from '../../util/Breadcrumbs';
// import img from '../../assets/image/card5.jpg';
import Button from '../shared/Button';
import { IoBarChart } from 'react-icons/io5';
import { FaFile } from 'react-icons/fa6';
import { FaGraduationCap } from 'react-icons/fa';
// import { BsQuestionSquareFill } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import DataBadge from '../shared/DataBadge';
import { courseCardType } from '../../pages/Home/homePageType';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
import config from '../../../config';
import { formatAmount } from '../../util/helperFunctions/helper';

export type headerbadge = {
	title: string;
	total: string;
	icon: IconType;
};

const HeaderContainer = (props: courseCardType) => {
	const {
		studentsQuantity,
		level,
		createdAt,
		imageCover,
		title,
		price,
		category,
		instructors,
	} = props;
	const navigate = useNavigate();
	const handleStartCourse = (to: string) => {
		navigate(to);
	};

	const dataDisplay: headerbadge[] = [
		{
			title: 'Students',
			total: studentsQuantity + '',
			icon: FaGraduationCap,
		},
		{
			title: level,
			total: '',
			icon: IoBarChart,
		},
		{
			title: 'Lessons',
			total: '20',
			icon: FaFile,
		},
		{
			title: handleDateFormat(createdAt),
			total: '',
			icon: IoMdTime,
		},
	];

	const testing = 'thisisworking';
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
								<span className='text-xs font-bold'>{category?.name}</span>
							</span>
							<span>by</span>
							{instructors?.map((el, index, arr) => (
								<span key={el._id}>
									{index === arr.length - 1 ? '& ' : index > 0 ? ', ' : ''}
									{el?.userId.name}
								</span>
							))}
							<span></span>
						</div>
					</div>

					<h1 className='my-2'>React and Redux master class</h1>

					{/* displays summary of the course  with icons e.g totla students */}
					<DataBadge dataDisplay={dataDisplay} />
				</div>
				<div className='md:absolute md:right-0 md:top-5'>
					<figure className='md:w-56 md:h-44 md:bg-white rounded-t-lg'>
						<img
							src={`${config?.baseUrl}/course/${imageCover}`}
							alt={`${title}'s cover image`}
							className='w-full h-full object-cover rounded-t-lg'
						/>
						<figcaption className='flex items-center justify-between p-2 md:shadow-lg md:border text-white md:text-black'>
							<p>
								<span className='line-through text-white  md:text-secondary-light'>
									${formatAmount(price)}
								</span>{' '}
								<span className='text-green-500'>Free</span>
							</p>

							<Button
								className={
									' border text-white md:text-black p-2 rounded-full hover:text-effect-hover hover:border-effect-hover active:bg-effect-active active:text-white'
								}
								value={'Start now'}
								onClick={() => handleStartCourse(`/courses/lecture/${testing}`)}
							/>
						</figcaption>
					</figure>
				</div>
			</div>
		</section>
	);
};

export default HeaderContainer;
