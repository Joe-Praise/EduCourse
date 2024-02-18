import { ChangeEvent, FC, ReactNode } from 'react';
import FilterPageHeader from './FilterPageHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Pagination from './Pagination';

const FilterStructure: FC<{
	title: string;
	searchFunc: (_: ChangeEvent<HTMLInputElement>) => void;
	layoutFunc: (_: string) => void;
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
	return (
		<section>
			<div className='grid grid-cols-6 gap-3 xl:gap-12 mt-2  layoutWidth items-start overflow-y-auto h-[120vh]'>
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
								: 'gap-2'
						} my-2 p-2`}
					>
						{children1}
					</div>
				</div>
				<div
					className={`col-span-2 
			 sm:translate-x-0 sm:sticky sm:top-4 z-20 w-10/12 mx-auto duration-150 overflow-auto 
			 ${
					displayFilter
						? 'translate-x-[0] fixed z-30 top-0 left-0 max-h-screen bg-white w-full my-2'
						: '-translate-x-[150%]'
				}
			`}
				>
					{children2}
				</div>
			</div>
			<div className=' bottom-0'>
				<Pagination
					data={[
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
						'lorem',
					]}
					// getData={(data) => {
					// 	console.log(data);
					// }}
				/>
			</div>
		</section>
	);
};

export default FilterStructure;

// ${
// 	displayFilter
// 		? 'translate-x-[0] fixed z-30 top-0 left-0 max-h-screen bg-white w-full my-2'
// 		: '-translate-x-[150%]'
// }

{
	/* <div className='absolute bottom-0'> */
}
// <Pagination
// 	data={[
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 		'lorem',
// 	]}
// getData={(data) => {
// 	console.log(data);
// }}
// />
{
	/* </div>*/
}
