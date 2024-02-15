import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import LayoutHeader from '../../widgets/LayoutHeader/LayoutHeader';
import LayoutFooter from '../../widgets/LayoutFooter/LayoutFooter';

const Layout: FC = () => {
	return (
		<div className='layoutHightWithGrid overflow-x-hidden'>
			<LayoutHeader />
			<main>
				<Outlet />
			</main>
			<footer className='mt-[3rem]'>
				<LayoutFooter />
			</footer>
		</div>
	);
};

export default Layout;
