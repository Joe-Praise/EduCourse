import { ChangeEvent, FC } from 'react';
import FilterPageHeader from './FilterPageHeader';
// import CourseCard from './Course/CourseCard';
// import img from '../assets/image/card5.jpg';
// import FilterActionMenu from './FilterActionMenu';
// import FilterActionBtn from './FilterActionBtn';
type event = ChangeEvent<HTMLInputElement>;

const FilterStructure: FC<{
	title: string;
	searchFunc: (e: event) => void;
	layoutFunc: (value: string) => void;
	children1: JSX.Element;
	children2: JSX.Element;
	activeLayout: string;
}> = ({
	title,
	searchFunc,
	layoutFunc,
	children1,
	children2,
	activeLayout,
}) => {
	const arr = Array.from(Array(4), () => 0);

	return (
		<section className='grid grid-cols-6 gap-3 xl:gap-12 w-11/12 sm:w-9/12 md:w-11/12 xl:w-9/12 mx-auto mt-2 relative'>
			<div className='col-start-1 col-span-6 sm:col-span-4 '>
				<FilterPageHeader
					title={title}
					searchFunc={searchFunc}
					layoutFunc={layoutFunc}
					activeLayout={activeLayout}
				/>

				<div
					className={`${
						activeLayout === 'grid'
							? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
							: 'gap-4'
					} my-2 p-2`}
				>
					{children1}
				</div>
				<ul className='flex gap-2 justify-center'>
					{arr.map((_, i) => {
						return (
							<li
								key={i}
								className='w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer  duration-150 hover:bg-black hover:text-white'
							>
								{i + 1}
							</li>
						);
					})}
				</ul>
			</div>
			<div
				className='col-span-2 absolute 
			-translate-x-52 sm:translate-x-0 sm:sticky top-0 w-10/12 mx-auto max-h-[85vh] overflow-y-auto
			'
			>
				{children2}
			</div>
		</section>
	);
};

export default FilterStructure;
