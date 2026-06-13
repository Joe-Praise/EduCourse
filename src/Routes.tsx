/* eslint-disable react-refresh/only-export-components --
   Route table: this module intentionally exports route-descriptor arrays
   alongside lazy() component references. It is not a fast-refresh boundary,
   so the only-export-components rule does not apply here. */
import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

type LazyComponent = LazyExoticComponent<ComponentType>;

const Signin = lazy(() => import('./pages/Signin/Signin'));
const Signup = lazy(() => import('./pages/Signup/SignUp'));
const ForgotPassword = lazy(() => import('./pages/Forgot Password/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Reset Password/ResetPassword'));
const Courses = lazy(() => import('./pages/Courses/Course'));
const SingleCourse = lazy(() => import('./pages/Single Course/SingleCourse'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const LectureCourse = lazy(() => import('./pages/Main Course/LectureCourse'));
const SingleBlog = lazy(() => import('./pages/Single Blog/SingleBlog'));
const MyLearning = lazy(() => import('./pages/My Learning/MyLearning'));
const FrequentlyAsked = lazy(() => import('./pages/FAQ/FrequentlyAsked'));
const Instructors = lazy(() => import('./pages/Instructors/Instructors'));
const SingleInstructor = lazy(() => import('./pages/Single Instructor/SingleInstructor'));
const PublicProfile = lazy(() => import('./pages/Public Profile/PublicProfile'));
const InstructorDashboard = lazy(() => import('./pages/Instructor Dashboard/InstructorDashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const ProfileSettings = lazy(() => import('./pages/Profile/ProfileSettings'));
const NotificationsPage = lazy(() => import('./pages/Notifications/NotificationsPage'));
const CourseBuilder = lazy(() => import('./pages/Course Builder/CourseBuilder'));
const LessonBuilder = lazy(() => import('./features/builder/lesson/LessonBuilder'));
const MyCertificates = lazy(() => import('./pages/Certificates/MyCertificates'));
const Certificate = lazy(() => import('./pages/Certificates/Certificate'));
const SearchPage = lazy(() => import('./pages/Search/Search'));

interface RouteDescriptor {
	path: string;
	component: LazyComponent;
	children?: ReadonlyArray<RouteDescriptor>;
}

export const publicRoutes: ReadonlyArray<RouteDescriptor> = [
	{
		path: '/courses',
		component: Courses,
		children: [{ path: ':slug', component: SingleCourse }],
	},
	{
		path: '/blogs',
		component: Blog,
		children: [{ path: ':slug', component: SingleBlog }],
	},
	{
		path: '/faqs',
		component: FrequentlyAsked,
		children: [{ path: ':slug', component: SingleBlog }],
	},
	{
		path: '/instructors',
		component: Instructors,
	},
	{
		path: '/instructors/:id',
		component: SingleInstructor,
	},
	{
		path: 'user/:slug',
		component: PublicProfile,
	},
	{
		path: '/search',
		component: SearchPage,
	},
];

export const protectedRoutes: ReadonlyArray<RouteDescriptor> = [
	{ path: '/courses/:slug/lecture/:courseId', component: LectureCourse },
	{ path: 'my-courses/learning', component: MyLearning },
	{ path: '/instructor/dashboard', component: InstructorDashboard },
	{ path: '/wishlist', component: Wishlist },
	{ path: '/certificates', component: MyCertificates },
	{ path: '/certificates/:id', component: Certificate },
	{ path: '/profile', component: ProfileSettings },
	{ path: '/notifications', component: NotificationsPage },
	{ path: '/instructor/courses/new', component: CourseBuilder },
	{ path: '/instructor/courses/:courseId/edit', component: CourseBuilder },
	{ path: '/instructor/lessons/:lessonId/edit', component: LessonBuilder },
];

export const authRoutes: ReadonlyArray<RouteDescriptor> = [
	{ path: '/signup', component: Signup },
	{ path: '/signin', component: Signin },
	{ path: '/forgot-password', component: ForgotPassword },
	{ path: '/reset-password/:token', component: ResetPassword },
];
