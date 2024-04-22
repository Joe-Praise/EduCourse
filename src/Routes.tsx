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
	Instructors,
	SingleInstructor,
	PublicProfile,
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
	{
		path: '/instructors',
		component: Instructors,
		children: [
			{
				path: ':slug',
				component: SingleInstructor,
			},
		],
	},
	{
		path: 'user/:slug',
		component: PublicProfile,
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
