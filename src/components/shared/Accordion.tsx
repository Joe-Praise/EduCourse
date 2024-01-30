import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AccordionBtnIcon } from '../../assets/Svg';
import AccordionBtn from './AccordionBtn';

type items = {
	title: string;
	duration: string;
	lessonIndex: string;
};

// add more field when API data comes from the backend
type accordion = {
	title: string;
	items: items[];
};

const showCheckBox = [/\/courses\/lecture/].map((regex) => new RegExp(regex));

const Accordion: FC<{ content: accordion }> = ({ content }) => {
	console.log(content);
	/**
	 * isMainCourse: is used to check if the url permitted to watch videos
	 */
	const [isMainCourse, setIsMainCourse] = useState(false);
	const [accordionOpen, setAccordionOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const showCheckbox = showCheckBox.some((regex) =>
			regex.test(location.pathname)
		);

		setIsMainCourse(showCheckbox);
	}, [location.pathname]);

	return (
		<div
			className={`bg-white text-black rounded-lg p-3 my-1 ${
				isMainCourse ? 'border-b' : ''
			} `}
		>
			<button
				className='flex justify-between w-full items-center'
				onClick={() => setAccordionOpen((prevState) => !prevState)}
			>
				<span>{content.title}</span>
				<div className='text-xs flex items-center gap-1'>
					<span className='hidden md:inline-block'>5 lessons</span>
					<span className='hidden md:inline-block'>45 mins</span>
					<AccordionBtnIcon accordionOpen={accordionOpen} />
				</div>
			</button>
			<div
				className={`grid overflow-hidden transition-all duration-300 ease-in-out  text-sm ${
					accordionOpen
						? 'grid-rows-[1fr] opacity-100'
						: 'grid-rows-[0fr] opacity-0'
				}`}
			>
				<ul className='overflow-hidden'>
					{content.items
						?.sort((a, b) => parseInt(a.lessonIndex) - parseInt(b.lessonIndex))
						.map((el, idx) => {
							return (
								<AccordionBtn key={idx} item={el} isMainCourse={isMainCourse} />
							);
						})}
				</ul>
			</div>
		</div>
	);
};

export default Accordion;
