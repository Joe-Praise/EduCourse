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
} from './pages/index';

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
				component: SingleBlog,
			},
		],
	},
];

export const protectedRoutes = [
	{
		path: 'courses/lecture/:id',
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
