import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import LayoutHeader from '../../widgets/LayoutHeader/ui/LayoutHeader';

const Layout: FC = () => {
	return (
		<div className='h-screen overflow-x-hidden'>
			<LayoutHeader />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
