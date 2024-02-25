import { useState } from 'react';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { MdCheckBox } from 'react-icons/md';
import { FilterType } from './type';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import { FaStar } from 'react-icons/fa6';
// import useQueryString from '../../hooks/UseQueryString';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
	removeQueryFilterAction,
	setQueryFilterAction,
} from '../../redux/actions/courseAction';

interface Iprop {
	header: string;
	values: any[];
}

const FilterActionList = (props: Iprop) => {
	const dispatch: AppDispatch = useDispatch();
	const { values, header } = props;

	// const {queryString, setQueryString]
	// const { queryString, addQuerySting, removeQueryString, StringifyQuery } =
	// 	useQueryString();

	const [active, setActive] = useState<string>('');

	const handleChange = (data: FilterType) => {
		let key = header;
		if (key === 'Price') {
			key = 'priceCategory';
		}
		const obj = {
			[key]: data._id + '',
		};
		// addQuerySting(obj);

		if (active === data?._id) {
			setActive('');
			dispatch(removeQueryFilterAction(obj));
		} else {
			dispatch(setQueryFilterAction(obj));
			setActive(data?._id);
		}
	};

	const arr = [1, 2, 3, 4, 5];

	const handleFilterDisplay = (el: any) => {
		if (header === 'Review') {
			return (
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
			);
		} else {
			return (
				<div className='flex gap-3 justify-between flex-1'>
					<span>
						{header === 'Instructors'
							? capitalizeFirstLetters(el?.userId?.name)
							: capitalizeFirstLetters(el?.name)}
					</span>
				</div>
			);
		}
	};
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

						{/* handles the display of the filters */}
						{handleFilterDisplay(el)}
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

{
	/* {header === 'Review' ? (
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
									{header === 'Instructors'
										? capitalizeFirstLetters(el?.userId?.name)
										: capitalizeFirstLetters(el?.name)}
								</span>
							</div>
						)} */
}
