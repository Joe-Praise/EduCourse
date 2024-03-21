import { ReactNode } from 'react';

export type ModalRef = {
	open(): void;
	close(): void;
};

type Jsx = ReactNode;

export type lectureType = {
	children1?: Jsx;
	children2?: Jsx;
	children3?: Jsx;
	children4?: Jsx;
	isHideCourseContent?: boolean;
	onWindowSize: number;
};
