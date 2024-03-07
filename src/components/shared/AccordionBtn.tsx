import { useState } from 'react';
import RenderIf from './RenderIf';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { FaLock } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { setVideoId } from '../../redux/actions/courseAction';

type items = {
	title: string;
	duration: string;
	lessonIndex: string;
	url: string;
};

interface Iprop {
	item: items;
	isMainCourse: boolean;
}

const AccordionBtn = (props: Iprop) => {
	const dispatch: AppDispatch = useDispatch();
	const { item, isMainCourse } = props;
	const [isChecked, setIsChecked] = useState(false);

	const handleChange = (item: items) => {
		setIsChecked((prevState) => !prevState);
		console.log(item);
		const videoId = item.url;

		// carry out the dispatch here
		dispatch(setVideoId(videoId));
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
