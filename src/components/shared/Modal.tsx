import { ReactNode, useImperativeHandle, useRef } from 'react';
import { forwardRef } from 'react';
import Button from './Button';
interface Iprop {
	children: ReactNode;
}

interface ModalRef {
	open(): void;
	close(): void;
}

const Modal = forwardRef<ModalRef, Iprop>((props: Iprop, ref) => {
	const { children } = props;
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
			className='backdrop:bg-black backdrop:opacity-30 w-1/2 rounded-lg p-3'
			ref={dialog}
			// onClick={handleCloseDialog}
		>
			{children}
			<form className='flex flex-col m-2' method='dialog'>
				<Button className='place-self-end btnStyle' size='w-20'>
					Close
				</Button>
			</form>
		</dialog>
	);
});

export default Modal;

Modal.displayName = 'Modal';
