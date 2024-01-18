import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs: FC = () => {
	const location = useLocation();

	const currentLink: string[] = [];
	const crumbs = location.pathname
		.split('/')
		.filter((crumb) => crumb !== '')
		.map((crumb, i, arr) => {
			currentLink.push(`/${crumb}`);
			return (
				<div className='border-red-600' key={crumb}>
					<Link to={currentLink.join('')}>
						{crumb} {i === arr.length - 1 ? '' : '>'}
					</Link>
				</div>
			);
		});

	return <div className='flex'>{crumbs}</div>;
};

export default Breadcrumbs;
