import { FC, ReactNode, useState } from 'react';

type tabheaderType = {
	CourseContent: string | undefined;
	Overview: string;
	Instructor: string;
	Reviews: string;
};

type Jsx = ReactNode;

const LectureTabContainer: FC<{
	children1: Jsx;
	children2: Jsx;
	children3: Jsx;
	children4: Jsx;
	isHideCourseContent: boolean;
}> = (props) => {
	const { children1, children2, children3, children4, isHideCourseContent } =
		props;
	const [activeView, setActiveView] = useState<string>('Overview');

	// setting the expected headers for the tabs
	const tabHeader: tabheaderType = {
		CourseContent: isHideCourseContent ? 'Course Content' : undefined,
		Overview: 'Overview',
		Instructor: 'Instructor',
		Reviews: 'Reviews',
	};

	console.log(isHideCourseContent);

	// switch the detail rendered content
	let display;

	switch (activeView) {
		case 'Course Content':
			display = children1;
			break;
		case 'Overview':
			display = children2;
			break;
		case 'Instructor':
			display = children3;
			break;
		case 'Reviews':
			display = children4;
			break;
		default:
			display = <p>This view is not available.</p>;
	}

	return (
		<div className='min-h-[40vh] md:w-3/4 mx-auto '>
			<ul className='flex gap-4 border-y'>
				{Object.entries(tabHeader).map(([, value], i) => (
					<li
						key={i}
						className={`p-2 cursor-pointer flex justify-center items-center ${
							activeView === value ? 'text-effect-active' : ''
						}`}
						onClick={() => setActiveView(value || '')}
					>
						{value}
					</li>
				))}
			</ul>

			<div className='p-2 rounded-b-md'>{display}</div>
		</div>
	);
};

export default LectureTabContainer;

// bg-effect-active text-white
