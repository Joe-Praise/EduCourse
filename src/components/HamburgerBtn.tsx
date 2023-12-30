import { FC } from 'react';

const Hamburger: FC<{
	toggleHamburger: () => void;
	HamburgerState: boolean;
}> = (props) => {
	const isClosed = props.HamburgerState;

	return (
		<div onClick={props.toggleHamburger} className='cursor-pointer p-3'>
			<div
				className={`w-7 h-[3px] bg-black duration-75 ${
					isClosed && 'rotate-45 translate-y-[0.2rem]'
				}`}
			></div>
			<div
				className={`w-7 h-[3px] bg-black my-1 ${isClosed && 'hidden'}`}
			></div>
			<div
				className={`w-7 h-[3px] bg-black duration-75 ${
					isClosed && '-rotate-45 -translate-y-[.0rem] '
				}`}
			></div>
		</div>
	);
};

export default Hamburger;
