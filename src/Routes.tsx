// import { lazy } from 'react';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/SignUp';
import {
	Courses,
	SingleCourse,
	Blog,
	LectureCourse,
	SingleBlog,
	MyLearning,
	FrequentlyAsked,
} from './pages/index';

export const publicRoutes = [
	{
		path: '/courses',
		component: Courses,
		children: [
			{
				path: ':slug',
				component: SingleCourse,
			},
		],
	},
	{
		path: '/blogs',
		component: Blog,
		children: [
			{
				path: ':slug',
				component: SingleBlog,
			},
		],
	},
	{
		path: '/faqs',
		component: FrequentlyAsked,
		children: [
			{
				path: ':slug',
				component: SingleBlog,
			},
		],
	},
];

export const protectedRoutes = [
	{
		path: '/courses/:slug/lecture/:courseId',
		component: LectureCourse,
	},
	{
		path: 'my-courses/learning',
		component: MyLearning,
	},
];

export const authRoutes = [
	{
		path: '/signup',
		component: Signup,
	},
	{
		path: '/signin',
		component: Signin,
	},
];
