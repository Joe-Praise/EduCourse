import { accordionType } from '../../pages/Courses/courseType';
import { ModuleType } from '../../redux/actions/courseAction';
// import { courseCardType } from '../../pages/Home/homePageType';
import Accordion from '../shared/Accordion';
interface Iprop {
	modules: ModuleType[];
}
const Curriculum = (props: Iprop) => {
	const { modules } = props;

	// const { _id, courseId, title, moduleIndex, createdAt, lessons } = props;
	// const dropDown1: accordionType[] = [
	// 	{
	// 		title: 'Module 1',
	// 		items: [
	// 			{
	// 				title: 'lesson 2',
	// 				duration: '10:01',
	// 				lessonIndex: '2',
	// 			},
	// 			{
	// 				title: 'lesson 3',
	// 				duration: '5:01',
	// 				lessonIndex: '3',
	// 			},
	// 			{
	// 				title: 'lesson 1',
	// 				duration: '15:01',
	// 				lessonIndex: '1',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: 'Module 2',
	// 		items: [
	// 			{
	// 				title: 'lesson 2',
	// 				duration: '10:01',
	// 				lessonIndex: '2',
	// 			},
	// 			{
	// 				title: 'lesson 3',
	// 				duration: '5:01',
	// 				lessonIndex: '3',
	// 			},
	// 			{
	// 				title: 'lesson 1',
	// 				duration: '15:01',
	// 				lessonIndex: '1',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: 'Module 3',
	// 		items: [
	// 			{
	// 				title: 'lesson 2',
	// 				duration: '10:01',
	// 				lessonIndex: '2',
	// 			},
	// 			{
	// 				title: 'lesson 3',
	// 				duration: '5:01',
	// 				lessonIndex: '3',
	// 			},
	// 			{
	// 				title: 'lesson 1',
	// 				duration: '15:01',
	// 				lessonIndex: '1',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: 'Module 4',
	// 		items: [
	// 			{
	// 				title: 'lesson 2',
	// 				duration: '10:01',
	// 				lessonIndex: '2',
	// 			},
	// 			{
	// 				title: 'lesson 3',
	// 				duration: '5:01',
	// 				lessonIndex: '3',
	// 			},
	// 			{
	// 				title: 'lesson 1',
	// 				duration: '15:01',
	// 				lessonIndex: '1',
	// 			},
	// 		],
	// 	},
	// ];
	// console.log(props);
	return (
		<div>
			{modules
				?.sort((a, b) => a.moduleIndex - b.moduleIndex)
				.map((el: accordionType) => {
					return <Accordion content={el} key={el._id} />;
				})}
		</div>
	);
};

export default Curriculum;
