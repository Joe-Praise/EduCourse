import { ChangeEvent, FC } from 'react';
import SearchAndLayout from './SearchAndLayout';
// import { stateBoolean } from '../pages/Courses/types/courseType';

interface headerType {
	title: string;
	searchFunc: (e: ChangeEvent<HTMLInputElement>) => void;
	layoutFunc: (value: string) => void;
	activeLayout: string;
}

const FilterPageHeader: FC<headerType> = (props) => {
	return (
		<div className='flex justify-between flex-wrap items-end sticky top-0 z-20 bg-white p-3 shadow-lg'>
			<h1 className='basis-full sm:basis-auto'>{props.title}</h1>
			<SearchAndLayout
				handleSearch={props.searchFunc}
				handleLayout={props.layoutFunc}
				activeLayout={props.activeLayout}
			/>
		</div>
	);
};

export default FilterPageHeader;