import { ReactNode } from 'react';

interface Iprop {
	children: ReactNode;
	className: string;
}

const WhiteBackground = (props: Iprop) => {
	const { children, className } = props;
	return (
		<section
			className={`w-100 max-w-[95rem] mx-auto h-full bg-white rounded-lg ${className}`}
		>
			{children}
		</section>
	);
};

export default WhiteBackground;
