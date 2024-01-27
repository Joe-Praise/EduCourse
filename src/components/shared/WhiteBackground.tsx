import { FC, ReactNode } from 'react';

interface childrenProp {
	children: ReactNode;
	className: string;
}

const WhiteBackground: FC<childrenProp> = ({ children, className }) => {
	return (
		<section
			className={`w-100 max-w-[95rem] mx-auto h-full bg-white rounded-lg ${className}`}
		>
			{children}
		</section>
	);
};

export default WhiteBackground;
