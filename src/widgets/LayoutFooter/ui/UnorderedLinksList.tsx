import { FC } from 'react';
import { Link } from 'react-router-dom';
import { linkType } from '../../LayoutHeader/model/navigationType';

const LinksList: FC<{ link: linkType[] }> = (props) => {
	return (
		<ul>
			{props?.link?.map((el) => (
				<li key={el.id}>
					<Link to={el.path} className='py-1 block hover:text-secondary-dark'>
						{el.name}
					</Link>
				</li>
			))}
		</ul>
	);
};

export default LinksList;
