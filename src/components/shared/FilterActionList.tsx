import { useState } from 'react';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { MdCheckBox } from 'react-icons/md';
import { FilterType } from './type';

interface Iprop {
	values: FilterType[];
}

const FilterActionList = (props: Iprop) => {
	const { values } = props;

	const [active, setActive] = useState<string>('');

	const handleChange = (data: FilterType) => {
		if (active === data._id) {
			setActive('');
		} else {
			setActive(data?._id);
		}
	};

	return (
		<ul className='list-none w-full'>
			{values.map((el) => {
				return (
					<li
						className='flex justify-start items-center gap-2 py-1 cursor-pointer hover:bg-black hover:text-white px-1 text-sm'
						onClick={() => {
							handleChange(el);
						}}
						key={el?._id}
					>
						{active === el?._id ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}

						<div className='flex gap-3 justify-between flex-1'>
							<span>{el?.name}</span>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default FilterActionList;

{
	/* <ul className='list-none w-full'>
			{values.map((el, idx) => {
				return <FilterActionBtn key={idx} title={el} />;
			})}
		</ul> */
}
