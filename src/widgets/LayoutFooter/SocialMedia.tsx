import { FC } from 'react';
import { Link } from 'react-router-dom';
import { socialMediaProp } from './LayoutFooterModels';

const SocialMedia: FC<socialMediaProp> = ({ path, Icon }) => {
	return (
		<>
			<Link to={path} className='p-1 block'>
				<Icon className='hover:text-secondary-dark w-4 h-4 text-gray-600' />
			</Link>
		</>
	);
};

export default SocialMedia;
