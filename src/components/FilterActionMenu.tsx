import { FC } from 'react';

import FilterActionBtn from './FilterActionBtn';

const FilterActionMenu: FC<{ header: string }> = ({ header }) => {
	const arr = Array.from(Array(6), () => 0);
	return (
		<div className='w-[95%] mx-auto my-3'>
			<h1 className='text-sm'>{header}</h1>
			{/* <div> */}
			<ul className='list-none w-full'>
				{arr.map((_, idx) => {
					return <FilterActionBtn key={idx} />;
				})}
			</ul>
			{/* </div> */}
		</div>
	);
};

export default FilterActionMenu;
