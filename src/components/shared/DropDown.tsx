import { useRef, useState, useEffect } from 'react';
import { IoMdArrowDown } from 'react-icons/io';
import { capitalizeFirstLetters } from '../../util/helperFunctions/helper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
	removeQueryFilterAction,
	setQueryFilterAction,
} from '../../redux/actions/courseAction';

interface Iprop {
	tag: string;
	items: any[];
	// handleQuerySearch: () => void;
	// index & arrLength is used to keep the last dropdown within the screen in mobile
	index: number;
	arrLength: number;
}

function DropDown(props: Iprop) {
	const { tag, items, index, arrLength } = props;
	const dispatch: AppDispatch = useDispatch();
	const dropDownRef = useRef<HTMLButtonElement>(null);

	const [selectValue, setSelectvalue] = useState({
		[tag]: '',
	});
	const [show, setShow] = useState({
		[tag]: false,
	});

	const [active, setActive] = useState('');

	const showMenuHandler = (tag: string) => {
		setShow((prevState) => {
			return {
				[tag]: !prevState[tag],
			};
		});
	};

	/**
	 * handleChange=> handles the change on click of a dropdown item
	 * @param data is info of the clicked dropdown item.
	 * it consist its _id, name and so on used to query the B.E
	 */
	const handleChange = (data: any) => {
		let key = tag;
		if (key === 'progress') {
			key = 'completed';
		}

		const obj = {
			[key]: data?._id + '',
		};

		if (active === data?._id) {
			setActive('');
			setSelectvalue({
				[tag]: '',
			});
			dispatch(removeQueryFilterAction(obj));
		} else {
			console.log(data);
			dispatch(setQueryFilterAction(obj));
			setActive(data?._id);
		}
	};

	const dropDownHandler = (value: any) => {
		const newVal = tag === 'instructors' ? value?.userId?.name : value?.name;

		// tag === 'instructor'
		// ? value?.userId?.name
		// : tag === 'category'
		// ? value?.name
		// : value?.title;

		// get the name to display it
		setSelectvalue({
			[tag]: newVal,
		});

		// hide the dropdown
		setShow({
			[tag]: false,
		});

		handleChange(value);
	};

	useEffect(() => {
		if (!show[tag]) return;
		const handleClose = () => {
			window.addEventListener('click', (e) => {
				if (show[tag] && dropDownRef.current !== e.target) {
					setShow((prevState) => ({
						[tag]: !prevState,
					}));
				}
			});
		};
		handleClose();
	}, [show, tag]);

	const dropDownItem = (values: any) => {
		return (
			<ul
				className={`absolute z-10 bg-white top-[3.2rem] w-[170px] md:w-[280px] md ${
					index === arrLength - 1 ? '-left-10' : 'left-0 '
				} max-h-[40vh] overflow-auto border md:cursor-pointer md:top-[2.5rem]`}
			>
				{values?.map((el: any, i: number) => {
					return (
						<li
							onClick={() => dropDownHandler(el)}
							key={i}
							className='border-[1px] p-4'
						>
							{/* {tag === 'category' && el?.name} */}
							{tag === 'instructors'
								? capitalizeFirstLetters(el?.userId?.name)
								: capitalizeFirstLetters(el?.name)}
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<>
			<div className='relative '>
				<button
					className='flex justify-between items-center border-2 p-3 rounded-sm md:basis-[90] md:p-2 cursor-pointer'
					ref={dropDownRef}
					onClick={() => showMenuHandler(tag)}
				>
					{selectValue[tag] === ''
						? capitalizeFirstLetters(tag)
						: capitalizeFirstLetters(selectValue[tag])}

					<IoMdArrowDown className='animate-bounce' />
				</button>
				{show[tag] ? dropDownItem(items) : <></>}
			</div>
		</>
	);
}

export default DropDown;
