import { ReactNode, useState } from 'react';

type tabheaderType = {
	Overview: string;
	Curriculum: string;
	Instructor: string;
	Reviews: string;
};

type Jsx = ReactNode;
interface Iprop {
	children1: Jsx;
	children2: Jsx;
	children3: Jsx;
	children4: Jsx;
}

const TabContainer = (props: Iprop) => {
	const { children1, children2, children3, children4 } = props;
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
			display = children1;
			break;
		case 'Curriculum':
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
			{/* md:max-h-[50vh] overflow-auto */}
			<div className='p-2 bg-effect-active text-white  rounded-b-md'>
				{display}
			</div>
		</div>
	);
};

export default TabContainer;
