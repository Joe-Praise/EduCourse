// import { IconType } from 'react-icons';

export type bannerTextType = {
	title: string;
	body: string;
};

// export type courseCardType = {
// 	img: string;
// 	instructors: string;
// 	coureTitle: string;
// 	createdAt: string;
// 	noOfStudents: string;
// 	price: string;
// 	category: string;
// 	// activeLayout is used to switch the layout ou=f the card and is added in the front end
// 	activeLayout: string;
// };
interface courseCard {
	_id: string;
	title: string;
	description: string;
	imageCover: string;
	level: string;
	language: string;
	instructors: Instructor[];
	category: Category;
	duration: string;
	ratingsAverage: number;
	ratingsQuantity: number;
	price: number;
	priceCategory: string;
	studentsQuantity: number;
	createdAt: string;
	slug: string;
	__v: number;
	id: string;
	totalLessons: number;
	activeLayout: any;
}

export type courseCardType = Omit<courseCard, '__v active'>;

export interface Category {
	_id: string;
	name: string;
	group: string;
}

export interface Instructor {
	_id: string;
	userId: UserID;
	links: string[];
	description: string;
}

export interface UserID {
	_id: string;
	name: string;
	email: string;
	role: string[];
	photo: string;
}

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
