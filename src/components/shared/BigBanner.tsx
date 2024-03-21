import { ReactNode } from 'react';
interface Iprop {
	img: string;
	children: ReactNode;
}

const BigBanner = (props: Iprop) => {
	const { img, children } = props;
	return (
		<div className='w-full h-[33.875rem] relative mb-3'>
			<img
				src={img}
				alt='Big Banner'
				className='w-[100%] h-[33.875rem] object-cover '
			/>
			<>{children}</>
		</div>
	);
};
export default BigBanner;
