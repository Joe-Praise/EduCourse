import { FC } from 'react';
import WhiteBackground from '../shared/WhiteBackground';
import { IoMdTime } from 'react-icons/io';
import { FaGraduationCap } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { courseCardType } from '../../pages/Home/homePageType';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
import config from '../../../config';
import { formatAmount } from '../../util/helperFunctions/helper';

const CourseCard: FC<courseCardType> = (props) => {
	// type test = {
	// 	name: string;
	// 	age: number;
	// };

	// type Nested = test & {
	// 	isDeveloper: boolean;
	// };

	// type Prettify<T> = {
	// 	[K in keyof T]: T[K];
	// };

	// type idk = Prettify<Nested>;

	return (
		<WhiteBackground
			className={`rounded-b-none my-0 w-full px-0 shadow-md hover:scale-105 duration-150 h-full ${
				props?.activeLayout === 'grid' ? 'sm:my-0' : 'my-5'
			}`}
		>
			<Link
				to={`/courses/${props.slug}`}
				className={`flex hover:text-effect-active relative ${
					props?.activeLayout === 'grid'
						? ' flex-col'
						: 'flex-row  md:h-[11rem]'
				}`}
			>
				<div
					className={`relative ${
						props?.activeLayout === 'grid'
							? 'pb-[12rem]'
							: 'pr-[8rem] md:pr-[14rem]'
					}`}
				>
					<figure
						className={`${
							props?.activeLayout === 'grid' ? 'h-full' : 'basis-[50%] h-full'
						}`}
					>
						<img
							src={`${config.baseUrl}/course/${props?.imageCover}`}
							alt=''
							className={`absolute top-0 w-full object-cover object-bottom ${
								props?.activeLayout === 'grid'
									? 'rounded-t-lg h-48'
									: 'rounded-l-lg h-full'
							}`}
						/>
					</figure>
				</div>
				<div
					className={`p-3 ${
						props?.activeLayout === 'grid'
							? 'basis-[50%]'
							: 'basis-full flex justify-between flex-col'
					}`}
				>
					<small>
						by{' '}
						<span className='font-bold'>
							{props?.instructors[0].userId.name}
						</span>
					</small>
					<p className='text-lg font-bold my-1'>{props?.title}</p>

					<div
						className={`items-center gap-3 text-sm ${
							props?.activeLayout === 'grid' ? 'flex' : 'block'
						}`}
					>
						<div className='flex items-center gap-1'>
							<IoMdTime className='fill-effect-active' />
							<span>{handleDateFormat(props?.createdAt)}</span>
						</div>

						<div className='flex items-center gap-1'>
							<FaGraduationCap className='fill-effect-active' />
							<span>
								{props?.studentsQuantity}{' '}
								{+props?.studentsQuantity > 1 ? 'students' : 'student'}
							</span>
						</div>
					</div>

					<div className=''>
						<div className='w-auto mx-auto mt-3 h-[0.1rem] bg-gray-300'></div>

						<div className='flex items-center justify-between mt-1'>
							<p>
								<span className='line-through text-secondary-light'>
									${formatAmount(props?.price)}
								</span>{' '}
								<span className='text-green-500'>Free</span>
							</p>

							<div className='border-none text-secondary-dark text-sm'>
								View More
							</div>
						</div>
					</div>
				</div>
				<div className='badge'>
					<span className='text-xs'>{props?.category?.name}</span>
				</div>
			</Link>
		</WhiteBackground>
	);
};

export default CourseCard;
