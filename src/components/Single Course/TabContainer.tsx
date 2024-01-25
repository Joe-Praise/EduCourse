import { FC, useState } from 'react';

type tabheaderType = {
	Overview: string;
	Curriculum: string;
	Instructor: string;
	Reviews: string;
};

type Jsx = JSX.Element;

const TabContainer: FC<{
	children1: Jsx;
	children2: Jsx;
	children3: Jsx;
	children4: Jsx;
}> = (props) => {
	const [activeView, setActiveView] = useState<string>('Overview');

	// setting the expected headers for the tabs
	const tabHeader: tabheaderType = {
		Overview: 'Overview',
		Curriculum: 'Curriculum',
		Instructor: 'Instructor',
		Reviews: 'Reviews',
	};

	// switch the detail rendered content
	let display;

	switch (activeView) {
		case 'Overview':
			display = props.children1;
			break;
		case 'Curriculum':
			display = props.children2;
			break;
		case 'Instructor':
			display = props.children3;
			break;
		case 'Reviews':
			display = props.children4;
			break;
		default:
			display = <p>This view is not available.</p>;
	}

	return (
		<div className='min-h-[40vh]'>
			<ul className='flex rounded-lg '>
				{Object.entries(tabHeader).map(([key, value], i, arr) => (
					<li
						key={i}
						className={`p-2 basis-1/4 border cursor-pointer flex justify-center items-center ${
							activeView === key ? 'bg-effect-active text-white' : ''
						} ${i === 0 ? 'rounded-tl-md' : ''} ${
							i === arr.length - 1 ? 'rounded-tr-md' : ''
						}`}
						onClick={() => setActiveView(value)}
					>
						{value}
					</li>
				))}
			</ul>
			<div className='p-2 bg-effect-active text-white md:max-h-[50vh] overflow-auto rounded-b-md'>
				{display}
			</div>
		</div>
	);
};

export default TabContainer;
