import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import LayoutHeader from '../../widgets/LayoutHeader/ui/LayoutHeader';
import LayoutFooter from '../../widgets/LayoutFooter/ui/LayoutFooter';

const Layout: FC = () => {
	return (
		<div className='h-screen overflow-x-hidden'>
			<LayoutHeader />
			<main>
				<Outlet />
			</main>
			<footer>
				<LayoutFooter />
			</footer>
		</div>
	);
};

export default Layout;
