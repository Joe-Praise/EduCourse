import { FC, Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from '../pages/Home/Home';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { authRoutes, protectedRoutes, publicRoutes } from '../Routes';
import PrivateRoutes from './PrivateRoutes';
import NotFound from '../pages/Not Found/NotFound';
import { Toastify } from '../components/shared';
import ScrollToTop from '../util/ScrollToTop';

// import the admin login page with lazy loading
// const AdminPanel = lazy(() => import("./pages/AdminPanel"));
// const AdminSignIn = lazy(() => import("./pages/AdminSignIn"));

const App: FC = () => {
	const userData = useSelector((state: RootState) => state.user?.userObj);

	return (
		<Fragment>
			<div className='absolute'>
				<Toastify />
			</div>
			<ScrollToTop />
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />

					{publicRoutes.map((route) => (
						<Fragment key={route.path}>
							<Route path={route.path} element={<route.component />} />
							{route.children &&
								route.children.length > 0 &&
								route.children.map((childRoute) => (
									<Route
										key={childRoute.path}
										path={`${route.path}/${childRoute.path}`}
										element={<childRoute.component />}
									/>
								))}
						</Fragment>
					))}
				</Route>
				<Route element={<PrivateRoutes user={userData} />}>
					{protectedRoutes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={<route.component />}
						/>
					))}
				</Route>

				{authRoutes.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={<route.component />}
					/>
				))}

				<Route path='*' element={<NotFound />} />
			</Routes>
		</Fragment>
	);
};

export default App;

// const localDetails = getLocalStorage('profile');
// const instructor =
// localDetails?.user?.role === 'instructor'
// 	? localDetails?.user?.token
// 	: null;
// const admin =
// localDetails?.user?.role === 'admin' ? localDetails?.user?.token : null;

// <Suspense fallback={<h1>Loading... Loading Page coming soon</h1>}>
// <Routes>
// 	<Route
// 		path='/signin'
// 		element={userData.length ? <Navigate to='/' /> : <Signin />}
// 	/>

// 	<Route path='/' element={<Layout />} />

// 	<Route path='/' element={<Layout />}>
// 		{systemRoutes.map(
// 			(route) =>
// 				// <Fragment key={route.path}>
// 				route.private ? (
// 					<Route
// 						path={route.path}
// 						element={userData?.length && <route.component />}
// 						key={route.path}
// 					/>
// 				) : (
// 					<Route
// 						path={route.path}
// 						element={<route.component />}
// 						key={route.path}
// 					>
// 						{route.children &&
// 							route.children.length > 0 &&
// 							route.children.map((childRoute) => (
// 								<Route
// 									key={childRoute.path}
// 									path={`${route.path}/${childRoute.component}`}
// 									element={<childRoute.component />}
// 								/>
// 							))}
// 					</Route>
// 				)
// 			// </Fragment>
// 			// loop through and use private route componet when private route is true and use normal route if false
// 		)}
// 	</Route>

// 	{/* <Route element={<PrivateRoutes user={userData} />}></Route> */}

// 	{/* <Route path='courses'>
// 				<Route index element={<Course />} />
// 				<Route path=':id' element={<SingleCourse />} />
// 			</Route>
// 			<Route path='/blogs'>
// 				<Route index element={<Blog />} />
// 				{/* <Route path='/:id' element={}/> */}
// 	{/* </Route> */}
// </Routes>
// // </Suspense>
