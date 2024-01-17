import { FC, useState } from 'react';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { MdCheckBox } from 'react-icons/md';

// type Dispatcher<S> = Dispatch<SetStateAction<S>>;
const FilterActionBtn: FC = () => {
	const [isChecked, setIsChecked] = useState(false);

	const handleChange = () => {
		setIsChecked((prevState) => !prevState);
	};

	return (
		<>
			<li
				className='flex justify-start items-center gap-2 py-1 cursor-pointer hover:bg-black hover:text-white px-1 text-sm'
				onClick={handleChange}
			>
				{isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}

				<div className='flex gap-3 justify-between flex-1'>
					<span>Commercial</span>
					<span>15</span>
				</div>
			</li>
		</>
	);
};

export default FilterActionBtn;
