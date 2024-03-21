const dev = {
	baseUrl: 'http://localhost:3050',
	// baseUrl: 'https://educourse.onrender.com',
};

const urlPath = 'https://edu-course.vercel.app';
const userData = 'profile';

const config = {
	userData,
	...dev,
	urlPath,
};

export default config;
