import { ElementType, ReactNode } from 'react';

type Jsx = ReactNode;
interface Iprop {
	buttonContainer?: ElementType;
	lecture?: boolean;
	buttons: Jsx;
	children: Jsx;
}

const TabContainer = (props: Iprop) => {
	const {
		children,
		buttons,
		buttonContainer: ButtonContainer = 'ul',
		lecture,
	} = props;

	const handleDisplayContent = () => {
		if (lecture) {
			return <div className='p-2 rounded-b-md'>{children}</div>;
		} else {
			return (
				<div className='p-2 bg-effect-active text-white  rounded-b-md'>
					{children}
				</div>
			);
		}
	};

	return (
		<div className={`min-h-[40vh] ${lecture ? 'md:w-3/4 mx-auto ' : ''}`}>
			<ButtonContainer className='flex rounded-lg '>{buttons}</ButtonContainer>
			{handleDisplayContent()}
		</div>
	);
};

export default TabContainer;
