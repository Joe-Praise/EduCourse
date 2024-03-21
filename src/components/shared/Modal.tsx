import { ReactNode, useImperativeHandle, useRef } from 'react';
import { forwardRef } from 'react';
import { Button } from './';
import { IoClose } from 'react-icons/io5';
import { ModalRef } from '../../pages/Main Course/LectureType';
interface Iprop {
	children: ReactNode;
	className: string;
}

const Modal = forwardRef<ModalRef, Iprop>((props: Iprop, ref) => {
	const { children, className } = props;
	const dialog = useRef<HTMLDialogElement>(null);

	useImperativeHandle(ref, () => {
		return {
			open() {
				dialog.current!.showModal();
			},
			close() {
				dialog.current!.close();
			},
		};
	});

	return (
		<dialog
			className={`backdrop:bg-black backdrop:opacity-30 p-3 pt-0 ${className}`}
			ref={dialog}
			onClick={() => dialog.current!.close()}
		>
			<div onClick={(e) => e.stopPropagation()}>
				<form className='flex flex-col m-2' method='dialog'>
					<Button className='place-self-end btnStyle' size=''>
						<IoClose />
					</Button>
				</form>
				<div className='pb-5'>{children}</div>
			</div>
		</dialog>
	);
});

export default Modal;

Modal.displayName = 'Modal';
