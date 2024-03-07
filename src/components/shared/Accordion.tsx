import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AccordionBtnIcon } from '../../assets/Svg';
import AccordionBtn from './AccordionBtn';
import { accordionType } from '../../pages/Courses/courseType';

const showCheckBoxRegex = [/\/courses\/([^/]+)\/lecture\/[a-zA-Z0-9]+$/].map(
	(regex) => new RegExp(regex)
);

const Accordion: FC<{ content: accordionType }> = ({ content }) => {
	/**
	 * isMainCourse: is used to check if the url permitted to watch videos
	 */
	const [isMainCourse, setIsMainCourse] = useState(false);
	const [accordionOpen, setAccordionOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const showCheckbox = showCheckBoxRegex.some((regex) => {
			return regex.test(location.pathname);
		});

		setIsMainCourse(showCheckbox);
	}, [location.pathname]);

	return (
		<div
			className={`bg-white text-black rounded-lg p-3 my-1 ${
				isMainCourse ? 'border-b' : ''
			} `}
		>
			<button
				className='flex w-full items-center flex-wrap'
				onClick={() => setAccordionOpen((prevState) => !prevState)}
			>
				<div className='basis-full flex justify-between'>
					<span className=''>{content?.title}</span>

					<span className=''>
						<AccordionBtnIcon accordionOpen={accordionOpen} />
					</span>
				</div>
				<div className='text-xs flex items-center gap-1'>
					<span className='hidden md:inline-block'>
						{content?.lessons.length} lessons
					</span>
					<span className='hidden md:inline-block'>45 mins</span>
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
					{content?.lessons
						?.sort((a, b) => parseInt(a.lessonIndex) - parseInt(b.lessonIndex))
						.map((el) => {
							return (
								<AccordionBtn
									key={el._id}
									item={el}
									isMainCourse={isMainCourse}
								/>
							);
						})}
				</ul>
			</div>
		</div>
	);
};

export default Accordion;
