import { accordionType } from '../../pages/Courses/types/courseType';
import Accordion from '../shared/Accordion';

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
		{
			title: 'Module 2',
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
		{
			title: 'Module 3',
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
		{
			title: 'Module 4',
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
			{dropDown1.map((el, idx) => {
				return <Accordion content={el} key={idx} />;
			})}
		</div>
	);
};

export default Curriculum;
