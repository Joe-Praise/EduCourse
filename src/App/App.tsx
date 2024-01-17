import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from '../pages/Home/ui/Home';
import Course from '../pages/Courses/ui/Course';
import Blog from '../pages/Blog/ui/Blog';

const App: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='courses'>
						<Route index element={<Course />} />
					</Route>
					<Route path='blog'>
						<Route index element={<Blog />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
