import { ChangeEvent, FC } from 'react';
import SearchAndLayout from './SearchAndLayout';
import { autocompleteType } from '../../redux/api/courseAPI';

interface headerType {
	title: string;
	searchFunc: (_: ChangeEvent<HTMLInputElement>) => void;
	layoutFunc: (_: string) => void;
	activeLayout: string;
	autocomplete: autocompleteType[];
	redirectFunc: (_: autocompleteType) => void;
}

const FilterPageHeader: FC<headerType> = (props) => {
	return (
		<div className='flex justify-between flex-wrap items-end sticky top-0 z-20 bg-white p-3 shadow-lg'>
			<h1 className='basis-full sm:basis-auto'>{props.title}</h1>
			<SearchAndLayout
				handleSearch={props.searchFunc}
				handleLayout={props.layoutFunc}
				activeLayout={props.activeLayout}
				autocomplete={props.autocomplete}
				redirectFunc={props.redirectFunc}
			/>
		</div>
	);
};

export default FilterPageHeader;
