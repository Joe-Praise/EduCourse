// import { IconType } from 'react-icons';

export type bannerTextType = {
	title: string;
	body: string;
};

export type courseCardType = {
	img: string;
	instructor: string;
	coureTitle: string;
	createdAt: string;
	noOfStudents: string;
	price: string;
	category: string;
	// activeLayout is used to witch the layout ou=f the card and is added in the front end
	activeLayout: string;
};

export type articleCardType = {
	img: string;
	articleTitle: string;
	createdAt: string;
	summary: string;
};

export type topCategoryCardType = {
	// Icon: IconType;
	title: string;
	total: string;
};
export type detailCardType = {
	title: string;
	total: string;
	role: string;
};
