import { FC } from 'react';
import { IconType } from 'react-icons';
// import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';
type props = {
	path: string;
	Icon: IconType;
};

const SocialMedia: FC<props> = ({ path, Icon }) => {
	return (
		<li>
			<Link to={path}>
				{/* <img src={el.img} alt='social media img' /> */}
				<Icon className='djsld' />
			</Link>
		</li>
	);
};

export default SocialMedia;
