import { ChangeEvent } from 'react';
import { SearchAndLayout } from './';
import { autocompleteType } from '../../redux/sharedTypes';

interface headerType {
	title: string;
	searchFunc: (_: ChangeEvent<HTMLInputElement>) => void;
	layoutFunc: (_: string) => void;
	activeLayout: string;
	autocomplete: autocompleteType[];
	redirectFunc: (_: autocompleteType) => void;
}

const FilterPageHeader = (props: headerType) => {
	const {
		searchFunc,
		layoutFunc,
		activeLayout,
		autocomplete,
		redirectFunc,
		title,
	} = props;
	return (
		<div className='flex justify-between flex-wrap items-end sticky top-0 z-20 bg-white p-3 shadow-lg'>
			<h1 className='basis-full sm:basis-auto'>{title}</h1>
			<SearchAndLayout
				handleSearch={searchFunc}
				handleLayout={layoutFunc}
				activeLayout={activeLayout}
				autocomplete={autocomplete}
				redirectFunc={redirectFunc}
			/>
		</div>
	);
};

export default FilterPageHeader;
