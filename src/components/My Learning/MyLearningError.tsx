import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Iprop {
	to: string;
	children: ReactNode;
}

const MyLearningError = (props: Iprop) => {
	const { to, children } = props;
	return (
		<div className='flex flex-col gap-2 justify-center items-center h-[110vw] md:h-[25vw] uppercase'>
			{children}
			<Link to={to} className='underline text-lg'>
				Explore Courses
			</Link>
		</div>
	);
};

export default MyLearningError;
