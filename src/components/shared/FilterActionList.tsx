import { useState } from 'react';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { MdCheckBox } from 'react-icons/md';
import { FilterType } from './type';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import { FaStar } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
	removeQueryFilterAction,
	setQueryFilterAction,
} from '../../redux/actions/courseAction';
import { useLocation } from 'react-router-dom';
import {
	removeBlogQueryFilterAction,
	setBlogQueryFilterAction,
} from '../../redux/actions/blogAction';

interface Iprop {
	header: string;
	values: any[];
}
// function testPath(url: string) {
// 	if (url.startsWith('/blogs')) {
// 		return 'blog';
// 	} else if (url.startsWith('/courses')) {
// 		return 'course';
// 	}
// }

const FilterActionList = (props: Iprop) => {
	const location = useLocation();
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
			if (location.pathname.startsWith('/blog')) {
				dispatch(removeBlogQueryFilterAction(obj));
			} else if (location.pathname.startsWith('/courses')) {
				dispatch(removeQueryFilterAction(obj));
			}
		} else {
			if (location.pathname.startsWith('/blog')) {
				dispatch(setBlogQueryFilterAction(obj));
			} else if (location.pathname.startsWith('/courses')) {
				dispatch(setQueryFilterAction(obj));
			}
			setActive(data?._id);
		}
	};

	const arr = [1, 2, 3, 4, 5];

	/**
	 *
	 * @param el represents the values for each filter
	 * @returns return ui element based on different section of the filter
	 * if more ui's are added, create a condition ofr it here
	 */
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

	/**
	 *
	 * @returns the section layout with diffrenet ui's for example Tags ui being different
	 */
	const handleLayout = () => {
		if (header === 'Tag') {
			return (
				<ul className='list-none flex flex-wrap gap-1'>
					{values?.map((el) => (
						<button
							className='flex gap-1 md:gap-4 flex-wrap cursor-pointer hover'
							key={el?._id}
							onClick={() => {
								handleChange(el);
							}}
						>
							<span
								key={el._id}
								className={`tag  ${
									active === el._id ? 'bg-effect-active text-white' : ''
								}`}
							>
								{el.name}
							</span>
						</button>
					))}
				</ul>
			);
		} else {
			return (
				<ul className='list-none w-full'>
					{values?.map((el) => (
						<li
							onClick={() => {
								handleChange(el);
							}}
							key={el?._id}
						>
							<button className='flex justify-start items-center gap-2 py-1 cursor-pointer hover:bg-black hover:text-white px-1 text-sm'>
								{active === el?._id ? (
									<MdCheckBox />
								) : (
									<MdCheckBoxOutlineBlank />
								)}

								{/* handles the display of the filters */}
								{handleFilterDisplay(el)}
							</button>
						</li>
					))}
				</ul>
			);
		}
	};

	return <>{handleLayout()}</>;
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

// {header === 'Tag' ? (
// 	values?.map((el) => {
// 		return (
// 	<div className='flex item-center bg-black'>
// 		<div className='flex gap-2 md:gap-4 flex-wrap bg-emerald-300'>
// 			<span
// 				key={el._id}
// 				className='border border-gray-500 p-1 md:w-28 text-center text-[13px]'
// 			>
// 				{el.name}
// 			</span>
// 		</div>
// 	</div>
// 	)}
// ) : (
// 	values?.map((el) => {
// 		return (
// 	<li
// 		className='flex justify-start items-center gap-2 py-1 cursor-pointer hover:bg-black hover:text-white px-1 text-sm'
// 		onClick={() => {
// 			handleChange(el);
// 		}}
// 		key={el?._id}
// 	>
// 		{active === el?._id ? (
// 			<MdCheckBox />
// 		) : (
// 			<MdCheckBoxOutlineBlank />
// 		)}

// 		{/* handles the display of the filters */}
// 		{handleFilterDisplay(el)}
// 	</li>
// 	)}
// )

// )};
