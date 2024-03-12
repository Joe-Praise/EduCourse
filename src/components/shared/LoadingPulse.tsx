import { ReactNode } from 'react';

interface Iprop {
	children: ReactNode;
}

const LoadingPulse = (props: Iprop) => {
	const { children } = props;
	return (
		<div className='relative overflow-hidden'>
			<div className='shimmer'>{children}</div>
		</div>
	);
};

export default LoadingPulse;
