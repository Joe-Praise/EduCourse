import { Dispatch, SetStateAction } from 'react';
export type stateBoolean = Dispatch<SetStateAction<boolean>>;

interface dropDown {
	title: string;
	duration: string;
	lessonIndex: string;
}

export type accordionType = {
	title: string;
	items: dropDown[];
};
