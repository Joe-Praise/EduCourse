import { useEffect, useState } from 'react';

// type modalType = {}

export default function useHandleModal() {
	const [modal, setModal] = useState(false);

	const handleModal = () => {
		setModal((prevState) => !prevState);
	};

	const closeModal = () => {
		setModal(false);
	};

	useEffect(() => {
		const handleEscape = (event: { key: string }) => {
			if (event.key === 'Escape') {
				closeModal();
			}
		};

		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, []);

	return { modal, handleModal, closeModal };
}
