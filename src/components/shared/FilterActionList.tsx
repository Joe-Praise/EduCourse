import { useState } from 'react';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { MdCheckBox } from 'react-icons/md';
import { FilterType } from './type';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import { FaStar } from 'react-icons/fa6';

interface Iprop {
	header: string;
	values: any[];
}

const FilterActionList = (props: Iprop) => {
	const { values, header } = props;

	const [active, setActive] = useState<string>('');

	const handleChange = (data: FilterType) => {
		console.log(data);
		if (active === data?._id) {
			setActive('');
		} else {
			setActive(data?._id);
		}
	};
	const arr = [1, 2, 3, 4, 5];
	return (
		<ul className='list-none w-full'>
			{values?.map((el) => {
				return (
					<li
						className='flex justify-start items-center gap-2 py-1 cursor-pointer hover:bg-black hover:text-white px-1 text-sm'
						onClick={() => {
							handleChange(el);
						}}
						key={el?._id}
					>
						{active === el?._id ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}

						{header === 'Review' ? (
							<div className='flex gap-3 flex-1'>
								{arr.map((_, idx) => {
									return (
										<FaStar
											key={idx}
											className={`${
												idx < el._id ? 'fill-orange-400' : 'fill-slate-500'
											} h-3 w-3`}
										/>
									);
								})}
							</div>
						) : (
							<div className='flex gap-3 justify-between flex-1'>
								<span>
									{header === 'Instructor'
										? capitalizeFirstLetters(el?.userId?.name)
										: capitalizeFirstLetters(el?.name)}
								</span>
							</div>
						)}
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
