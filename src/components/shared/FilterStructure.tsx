import { ChangeEvent, ReactNode } from 'react';
import { FilterPageHeader } from './';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { autocompleteType } from '../../redux/sharedTypes';

interface Iprop {
	title: string;
	searchFunc: (_: ChangeEvent<HTMLInputElement>) => void;
	layoutFunc: (_: string) => void;
	children1: ReactNode;
	children2: ReactNode;
	children3: ReactNode;
	activeLayout: string;
	autocomplete: autocompleteType[];
	redirectFunc: (_: autocompleteType) => void;
}

const FilterStructure = (props: Iprop) => {
	const {
		title,
		searchFunc,
		layoutFunc,
		children1,
		children2,
		children3,
		activeLayout,
		autocomplete,
		redirectFunc,
	} = props;
	// const handelQuerySearch = (details: )=> {

	// }
	const course = useSelector((state: RootState) => state.course);
	const displayFilter = course.filterState;

	return (
		<section>
			<div className='grid grid-cols-6 gap-3 xl:gap-12 mt-2 layoutWidth items-start sm:overflow-y-auto '>
				<div className='col-start-1 col-span-6 sm:col-span-4 '>
					<FilterPageHeader
						title={title}
						searchFunc={searchFunc}
						layoutFunc={layoutFunc}
						activeLayout={activeLayout}
						autocomplete={autocomplete}
						redirectFunc={redirectFunc}
					/>

					<div
						className={`${
							activeLayout === 'grid'
								? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
								: 'gap-2'
						} gap-y-6 p-2`}
					>
						{children1}
					</div>
				</div>
				<div
					className={`col-span-2 
			 ${
					displayFilter
						? 'block translate-x-[0] -top-3 fixed z-30 inset-0 h-[100svh] overflow-auto bg-white w-full my-2'
						: '-translate-x-[150%] hidden sm:block sticky  sm:translate-x-[0] sm:h-full sm:max-h-[70svh]'
				}
			`}
				>
					{children2}
				</div>
			</div>
			<div className=' bottom-0'>{children3}</div>
		</section>
	);
};

export default FilterStructure;

{
	/* <div
					className={`col-span-2 
			 sm:translate-x-0  sm:top-4 z-20 w-10/12 mx-auto duration-150 overflow-auto 
			 ${
					displayFilter
						? 'translate-x-[0] fixed z-30 inset-0 h-[100svh] bg-white w-full my-2'
						: '-translate-x-[150%]'
				}
			`}
				></div> */
}
