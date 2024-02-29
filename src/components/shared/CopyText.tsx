// import { IoClose } from 'react-icons/io5';
import Button from './Button';
import { copyToClipBoard } from '../../util/helperFunctions/helper';
import PopUp from './PopUp';
import RenderIf from './RenderIf';
import { useState } from 'react';

interface Iprop {
	title: string;
	value: string;
}

const CopyText = (props: Iprop) => {
	const { title, value } = props;
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyToClipBoard = (link: string) => {
		copyToClipBoard(link);
		setIsCopied((prevState) => !prevState);
	};

	return (
		<div className='bg-white w-3/4 p-3 mx-auto flex flex-col items-between justify-center gap-5'>
			<div className='flex justify-between items-center'>
				<h2>{title}</h2>
				{/* <button>
					<IoClose className='h-6 w-6' />
				</button> */}
			</div>
			<div className='relative flex items-center h-12 border'>
				<div className='basis-10/12 m-0 ps-2  '>
					{/* copytext is a custom style from index.css */}
					<p className='overflow-x-auto max-w-[450px] w-[430px] copyText text-nowrap'>
						{value}
					</p>
				</div>
				<Button
					className=' bg-black text-white flex-1 h-full border border-black'
					onClick={(e) => {
						e.stopPropagation();
						handleCopyToClipBoard(value);
					}}
				>
					Copy
				</Button>

				<RenderIf condition={isCopied}>
					{/* <div className=''> */}
					<PopUp message={'Copied!'} isButton={false} actionBtn={setIsCopied} />
					{/* </div> */}
				</RenderIf>
			</div>
		</div>
	);
};

export default CopyText;
