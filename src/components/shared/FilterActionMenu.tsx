import { FC } from 'react';

// import FilterActionBtn from './FilterActionBtn';
import FilterActionList from './FilterActionList';

const FilterActionMenu: FC<{ header: string }> = ({ header }) => {
	return (
		<div className='w-[95%] mx-auto my-3'>
			<h1 className='text-sm'>{header}</h1>

			<FilterActionList />
		</div>
	);
};

export default FilterActionMenu;
