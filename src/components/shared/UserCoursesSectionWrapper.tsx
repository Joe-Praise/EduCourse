import { ReactNode } from 'react';
interface Iprop {
	children: ReactNode;
}
const UserCoursesSectionWrapper = (props: Iprop) => {
	const { children } = props;
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-16'>
			{children}
		</div>
	);
};

export default UserCoursesSectionWrapper;
