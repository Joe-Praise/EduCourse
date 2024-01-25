import Accordion from '../Accordion';
interface dropDown {
	title: string;
	duration: string;
	lessonIndex: string;
}

interface accordionType {
	title: string;
	items: dropDown[];
}

const Curriculum = () => {
	const dropDown1: accordionType[] = [
		{
			title: 'Module 1',
			items: [
				{
					title: 'lesson 2',
					duration: '10:01',
					lessonIndex: '2',
				},
				{
					title: 'lesson 3',
					duration: '5:01',
					lessonIndex: '3',
				},
				{
					title: 'lesson 1',
					duration: '15:01',
					lessonIndex: '1',
				},
			],
		},
	];
	return (
		<div>
			<Accordion content={dropDown1} />
			{/* <Accordion content={dropDown1} />
			<Accordion content={dropDown1} />
			<Accordion content={dropDown1} /> */}
		</div>
	);
};

export default Curriculum;
