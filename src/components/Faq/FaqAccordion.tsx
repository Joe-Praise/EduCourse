import { useState } from 'react';
import { AccordionBtnIcon } from '../../assets/Svg';

interface Iprops {
	question: string;
	answer: string;
}
const FaqAccordion = (props: Iprops) => {
	const { question, answer } = props;
	const [accordionOpen, setAccordionOpen] = useState(false);

	return (
		<div
			className={`bg-white text-black rounded-lg my-1 w-full border shadow-sm`}
		>
			<button
				className='flex w-full items-center flex-wrap p-3'
				onClick={() => setAccordionOpen((prevState) => !prevState)}
			>
				<div className='basis-full flex justify-between items-center'>
					<span className=''>{question}</span>

					<span className=''>
						<AccordionBtnIcon accordionOpen={accordionOpen} />
					</span>
				</div>
			</button>
			<div
				className={`grid overflow-hidden transition-all duration-300 ease-in-out text-sm rounded-b-lg  bg-effect-active text-white ${
					accordionOpen
						? 'grid-rows-[1fr] opacity-100 p-3'
						: 'grid-rows-[0fr] opacity-0'
				}`}
			>
				<p className='overflow-hidden'>{answer}</p>

				{/* <ul className='overflow-hidden'>
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
				</ul> */}
			</div>
		</div>
	);
};

export default FaqAccordion;
