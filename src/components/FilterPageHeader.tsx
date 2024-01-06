import { ChangeEvent, FC } from 'react';
import SearchAndLayout from './SearchAndLayout';

interface headerType {
	title: string;
	searchFunc: (e: ChangeEvent<HTMLInputElement>) => void;
	layoutFunc: (value: string) => void;
}

const FilterPageHeader: FC<headerType> = (props) => {
	return (
		<div className='flex justify-between flex-wrap items-end'>
			<h1 className='basis-full sm:basis-auto'>{props.title}</h1>
			<SearchAndLayout
				handleSearch={props.searchFunc}
				handleLayout={props.layoutFunc}
			/>
		</div>
	);
};

export default FilterPageHeader;
