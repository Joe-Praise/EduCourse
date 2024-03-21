interface Iprop {
	toggleHamburger: () => void;
	HamburgerState: boolean;
}

const Hamburger = (props: Iprop) => {
	const { toggleHamburger, HamburgerState } = props;

	const isClosed = HamburgerState;

	return (
		<button onClick={toggleHamburger} className='cursor-pointer p-3'>
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
		</button>
	);
};

export default Hamburger;
