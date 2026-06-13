import { FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LayoutHeader from '../../widgets/LayoutHeader/LayoutHeader';
import { PageTransition } from '../../patterns/PageTransition/PageTransition';
import { EditorialFooter } from '../../features/home/EditorialFooter';

const Layout: FC = () => {
	const location = useLocation();
	// overflow-x-CLIP (not hidden): still prevents horizontal scroll but does NOT
	// create a scroll container, so the sticky header stays pinned
	// (overflow-x-hidden silently breaks position: sticky on descendants).
	return (
		<div className='min-h-svh flex flex-col overflow-x-clip'>
			<LayoutHeader />
			<main className='flex-1'>
				<PageTransition transitionKey={location.pathname}>
					<Outlet />
				</PageTransition>
			</main>
			<EditorialFooter />
		</div>
	);
};

export default Layout;
