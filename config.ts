const dev = {
	// baseUrl: 'http://localhost:3050',
	baseUrl: 'https://educourse.onrender.com',
};

const urlPath = 'https://edu-course.vercel.app';
const userConstant = 'profile';

const config = {
	userConstant,
	...dev,
	urlPath,
};

export default config;
