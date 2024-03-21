import { useEffect } from 'react';
import { RenderIf } from './';

type Iprop = {
	message: string;
	actionBtn: (_: any) => void;
	isButton: boolean;
};
const PopUp = (props: Iprop) => {
	const { message, actionBtn, isButton } = props;

	useEffect(() => {
		const timer = setTimeout(
			() => actionBtn((prevState: any) => !prevState),
			1000
		);
		return () => clearTimeout(timer);
	}, [actionBtn]);
	return (
		<div className='absolute -top-11 right-0 w-20 border rounded-lg bg-white text-black p-2 shadow-2xl'>
			<p className='text-center p-0 m-0'>{message}</p>
			<RenderIf condition={isButton}>
				<button className='btn' onClick={actionBtn}>
					close
				</button>
			</RenderIf>
		</div>
	);
};

export default PopUp;
