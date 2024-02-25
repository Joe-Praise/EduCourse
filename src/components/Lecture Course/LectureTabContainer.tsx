import { FC, useState } from 'react';

type tabheaderType = {
	CourseContent: string | undefined;
	Overview: string;
	Instructor: string;
	Reviews: string;
};

import { lectureType } from '../../pages/Main Course/LectureType';

const LectureTabContainer: FC<lectureType> = (props) => {
	const {
		children1,
		children2,
		children3,
		children4,
		isHideCourseContent,
		onWindowSize,
	} = props;

	const [activeView, setActiveView] = useState<string>('Overview');

	// setting the expected headers for the tabs
	const tabHeader: tabheaderType = {
		// this hides the course content when on desktop || course content(sidebar) is hidden
		CourseContent:
			isHideCourseContent || onWindowSize < 900 ? 'Course Content' : undefined,
		Overview: 'Overview',
		Instructor: 'Instructor',
		Reviews: 'Reviews',
	};

	// switch the detail rendered content
	let display;

	switch (activeView) {
		case 'Course Content':
			// checks if course content is hidden and gives focus to overview
			if (tabHeader.CourseContent === undefined) {
				setActiveView('Overview');
				display = children2;
			} else {
				display = children1;
			}
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
			display = children2;
	}

	return (
		<div className='min-h-[40vh] md:w-3/4 mx-auto '>
			<ul className='flex gap-4 border-y'>
				{Object.entries(tabHeader).map(([, value], i) => {
					console.log(value);
					return (
						<li
							key={i}
							className={`p-2 py-5 cursor-pointer flex justify-center items-center text-sm font-semibold ${
								activeView === value ? 'text-effect-active' : ''
							}`}
							onClick={() => setActiveView(value || '')}
						>
							{value}
						</li>
					);
				})}
			</ul>

			<div className='p-2 rounded-b-md'>{display}</div>
		</div>
	);
};

export default LectureTabContainer;

// bg-effect-active text-white
