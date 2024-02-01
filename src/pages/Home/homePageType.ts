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
	// activeLayout is used to switch the layout ou=f the card and is added in the front end
	activeLayout: string;
};

export type blogCardType = {
	img: string;
	instructor: string;
	articleTitle: string;
	createdAt: string;
	summary: string;
	activeLayout: string;
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
