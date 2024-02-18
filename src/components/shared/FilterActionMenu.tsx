import { FC } from 'react';

import FilterActionList from './FilterActionList';

const FilterActionMenu: FC<{
	header: string;
	values: any[];
}> = ({ header, values }) => {
	return (
		<div className='w-[95%] mx-auto my-3'>
			<h1 className='text-sm'>{header}</h1>
			<FilterActionList values={values} header={header} />
		</div>
	);
};

export default FilterActionMenu;
