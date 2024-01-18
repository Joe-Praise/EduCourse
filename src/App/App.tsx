import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from '../pages/Home/ui/Home';
import Course from '../pages/Courses/ui/Course';
import Blog from '../pages/Blog/ui/Blog';
import SingleCourse from '../pages/Single Course/ui/SingleCourse';

const App: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='courses'>
						<Route index element={<Course />} />
						<Route path=':id' element={<SingleCourse />} />
					</Route>
					<Route path='/blogs'>
						<Route index element={<Blog />} />
						{/* <Route path='/:id' element={}/> */}
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
