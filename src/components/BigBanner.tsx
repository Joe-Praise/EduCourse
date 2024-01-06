// import CentralizedHeaderText from './CentralizedHeaderText';
import { FC } from 'react';
interface props {
	img: string;
	children: JSX.Element;
}

const BigBanner: FC<props> = ({ img, children }) => {
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
