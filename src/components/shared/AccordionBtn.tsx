import { FC, useState } from 'react';
import RenderIf from './RenderIf';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { FaLock } from 'react-icons/fa6';

type items = {
	title: string;
	duration: string;
	lessonIndex: string;
};

interface Iprop {
	item: items;
	isMainCourse: boolean;
}

const AccordionBtn: FC<Iprop> = (props) => {
	const { item, isMainCourse } = props;
	const [isChecked, setIsChecked] = useState(false);

	const handleChange = (item: items) => {
		setIsChecked((prevState) => !prevState);
		console.log(item);
	};

	return (
		<li onClick={() => isMainCourse && handleChange(item)}>
			<button
				className={`flex items-center justify-between cursor-pointer p-2 active:bg-effect-focus active:text-white w-full ${
					isMainCourse ? '' : 'border-none'
				} `}
			>
				<div className='flex gap-3 items-center'>
					<RenderIf condition={isMainCourse}>
						{isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
					</RenderIf>
					<span>{item.title}</span>
				</div>
				<div className='text-xs flex items-center gap-2'>
					<span>{item.duration}</span>
					<RenderIf condition={!isMainCourse}>
						<FaLock className='fill-effect-active' />
					</RenderIf>
				</div>
			</button>
		</li>
	);
};

export default AccordionBtn;
