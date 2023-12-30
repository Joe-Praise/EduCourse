import { FC } from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { lazy, Suspense } from 'react';
// const router
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from '../pages/Home/ui/Home';

const App: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
