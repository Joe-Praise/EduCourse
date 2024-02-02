import { FC } from 'react';

// import FilterActionBtn from './FilterActionBtn';
import FilterActionList from './FilterActionList';
import { FilterType } from './type';

const FilterActionMenu: FC<{ header: string; values: FilterType[] }> = ({
	header,
	values,
}) => {
	return (
		<div className='w-[95%] mx-auto my-3'>
			<h1 className='text-sm'>{header}</h1>

			<FilterActionList values={values} />
		</div>
	);
};

export default FilterActionMenu;
