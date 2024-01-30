import { ChangeEvent, FC, ReactNode } from 'react';
import FilterPageHeader from './FilterPageHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type event = ChangeEvent<HTMLInputElement>;

const FilterStructure: FC<{
	title: string;
	searchFunc: (e: event) => void;
	layoutFunc: (value: string) => void;
	children1: ReactNode;
	children2: ReactNode;
	activeLayout: string;
}> = ({
	title,
	searchFunc,
	layoutFunc,
	children1,
	children2,
	activeLayout,
}) => {
	const displayFilter = useSelector(
		(state: RootState) => state.course.filterState
	);
	const arr = Array.from(Array(4), () => 0);

	return (
		<section className='grid grid-cols-6 gap-3 xl:gap-12 mt-2 relative layoutWidth'>
			<div className='col-start-1 col-span-6 sm:col-span-4'>
				<FilterPageHeader
					title={title}
					searchFunc={searchFunc}
					layoutFunc={layoutFunc}
					activeLayout={activeLayout}
					// setDisplayFilter={setDisplayFilter}
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
				<ul className='flex gap-2 justify-center mt-5'>
					{arr.map((_, i) => {
						return (
							<li
								key={i}
								className='w-9 h-9 border rounded-full flex justify-center items-center cursor-pointer duration-150 hover:bg-black hover:text-white'
							>
								{i + 1}
							</li>
						);
					})}
				</ul>
			</div>
			<div
				className={`col-span-2 
			 sm:translate-x-0 sm:sticky sm:top-4 w-10/12 mx-auto max-h-[85vh] duration-150 overflow-y-auto ${
					displayFilter
						? 'translate-x-[0] fixed z-30 top-0 left-0 max-h-screen bg-white w-full my-2'
						: '-translate-x-[150%]'
				}
			`}
			>
				{children2}
			</div>
		</section>
	);
};

export default FilterStructure;
