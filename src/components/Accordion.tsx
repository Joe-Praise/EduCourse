import { FC, useState } from 'react';
import { FaLock } from 'react-icons/fa6';
type items = {
	title: string;
	duration: string;
	lessonIndex: string;
};
type accordion = {
	title: string;
	items: items[];
};

const Accordion: FC<{ content: accordion[] }> = ({ content }) => {
	const [accordionOpen, setAccordionOpen] = useState(false);
	console.log(content);

	return (
		<div className='bg-white text-black rounded-lg p-3 my-1 '>
			<button
				className='flex justify-between w-full items-center'
				onClick={() => setAccordionOpen((prevState) => !prevState)}
			>
				<span>{content[0].title}</span>
				<div className='text-xs flex items-center gap-1'>
					<span className='hidden md:inline-block'>5 lessons</span>
					<span className='hidden md:inline-block'>45 mins</span>
					<svg
						className='fill-effect-active shrink-0 ml-8'
						width='16'
						height='16'
						xmlns='http://www.w3.org/2000/svg'
					>
						<rect
							y='7'
							width='16'
							height='2'
							rx='1'
							className={`transform origin-center transition duration-200 ease-out ${
								accordionOpen && '!rotate-180'
							}`}
						/>
						<rect
							y='7'
							width='16'
							height='2'
							rx='1'
							className={`transform origin-center rotate-90 transition duration-200 ease-out ${
								accordionOpen && '!rotate-180'
							}`}
						/>
					</svg>
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
					{content[0].items
						?.sort((a, b) => parseInt(a.lessonIndex) - parseInt(b.lessonIndex))
						.map((el, idx) => {
							return (
								// check if user has applied ? li should use link : no link and padlock icon present
								<li
									key={idx}
									className='flex items-center justify-between cursor-pointer p-2 active:bg-effect-focus active:text-white border-b'
								>
									<span>{el.title}</span>
									<div className='text-xs flex items-center gap-2'>
										<span>{el.duration}</span>
										<FaLock className='fill-effect-active' />
									</div>
								</li>
							);
						})}
				</ul>
			</div>
		</div>
	);
};

export default Accordion;
