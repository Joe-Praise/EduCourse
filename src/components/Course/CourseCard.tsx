import { WhiteBackground } from '../shared';
import { IoMdTime } from 'react-icons/io';
import { FaGraduationCap } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { courseCardType } from '../../pages/Home/homePageType';
import { handleDateFormat } from '../../util/helperFunctions/dateFormatter';
import config from '../../../config';
import { formatAmount, truncateValue } from '../../util/helperFunctions/helper';

const CourseCard = (props: courseCardType) => {
	const {
		activeLayout,
		slug,
		imageCover,
		title,
		instructors,
		createdAt,
		studentsQuantity,
		price,
		category,
	} = props;
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
				activeLayout === 'grid' ? 'sm:my-0' : 'my-5'
			}`}
		>
			<Link
				to={`/courses/${slug}`}
				className={`flex hover:text-effect-active relative ${
					activeLayout === 'grid' ? ' flex-col' : 'flex-row md:h-[11rem]'
				}`}
			>
				<div
					className={`relative ${
						activeLayout === 'grid' ? 'pb-[12rem]' : 'pr-[8rem] md:pr-[14rem]'
					}`}
				>
					<figure
						className={`${
							activeLayout === 'grid' ? 'h-full' : 'basis-[50%] h-full'
						}`}
					>
						<img
							src={`${config.baseUrl}/course/${imageCover}`}
							alt={`${title}'s cover image`}
							loading='lazy'
							className={`absolute top-0 w-full object-cover object-bottom ${
								activeLayout === 'grid'
									? 'rounded-t-lg h-48'
									: 'rounded-l-lg h-full'
							}`}
						/>
					</figure>
				</div>
				<div
					className={`p-3 ${
						activeLayout === 'grid'
							? 'basis-[50%]'
							: 'basis-full flex justify-between flex-col'
					}`}
				>
					<small>
						by <span className='font-bold'>{instructors[0]?.userId?.name}</span>
					</small>
					<p className='text-lg font-bold my-1'>
						{truncateValue(title, true, 29)}
					</p>

					<div
						className={`items-center gap-3 text-sm ${
							activeLayout === 'grid' ? 'flex' : 'block'
						}`}
					>
						<div className='flex items-center gap-1'>
							<IoMdTime className='fill-effect-active' />
							<span>{handleDateFormat(createdAt)}</span>
						</div>

						<div className='flex items-center gap-1'>
							<FaGraduationCap className='fill-effect-active' />
							<span>
								{studentsQuantity}{' '}
								{+studentsQuantity > 1 ? 'students' : 'student'}
							</span>
						</div>
					</div>

					<div className=''>
						<div className='w-auto mx-auto mt-3 h-[0.1rem] bg-gray-300'></div>

						<div className='flex items-center justify-between mt-1'>
							<p>
								<span className='line-through text-secondary-light'>
									${formatAmount(price)}
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
					<span className='text-xs'>{category?.name}</span>
				</div>
			</Link>
		</WhiteBackground>
	);
};

export default CourseCard;
