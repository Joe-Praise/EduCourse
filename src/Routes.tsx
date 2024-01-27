// import { lazy } from 'react';
import Signin from './pages/Signin/ui/Signin';
import Signup from './pages/Signup/ui/SignUp';
import { Courses, SingleCourse, Blog } from './pages/index';

export const publicRoutes = [
	{
		path: '/courses',
		component: Courses,
		children: [
			{
				path: ':id',
				component: SingleCourse,
			},
		],
	},
	{
		path: '/blogs',
		component: Blog,
		children: [
			{
				path: ':id',
				component: SingleCourse,
			},
		],
	},
];

export const protectedRoutes = [
	{
		path: 'courses/main/:id',
		component: SingleCourse,
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
