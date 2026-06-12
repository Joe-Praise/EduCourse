import { FC, Fragment, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from '../pages/Home/Home';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { authRoutes, protectedRoutes, publicRoutes } from '../Routes';
import PrivateRoutes from './PrivateRoutes';
import NotFound from '../pages/Not Found/NotFound';
import { Toastify, LoadingEffect } from '../components/shared';
import ScrollToTop from '../util/ScrollToTop';
import { CommandPalette } from '../patterns/CommandPalette/CommandPalette';
import { GrainOverlay } from '../patterns/GrainOverlay/GrainOverlay';
import { CinematicCursor } from '../patterns/Cursor/CinematicCursor';
import { useLenis } from '../lib/useLenis';

const RouteFallback = () => (
	<div className='py-24 grid place-items-center'>
		<LoadingEffect />
	</div>
);

const App: FC = () => {
	const userData = useSelector((state: RootState) => state.user?.userObj);
	useLenis();

	return (
		<Fragment>
			<div className='absolute'>
				<Toastify />
			</div>
			<ScrollToTop />
			<Suspense fallback={<RouteFallback />}>
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

						<Route element={<PrivateRoutes user={userData} />}>
							{protectedRoutes.map((route) => (
								<Route
									key={route.path}
									path={route.path}
									element={<route.component />}
								/>
							))}
						</Route>
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
			</Suspense>
			<CommandPalette />
			<GrainOverlay />
			<CinematicCursor />
		</Fragment>
	);
};

export default App;
