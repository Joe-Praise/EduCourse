import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaPinterestP } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';

export interface socialMediaType {
	platform: string;
	url: string;
}

const SocialMedia: FC<socialMediaType> = (props) => {
	let Icon;
	switch (props.platform) {
		case 'Facebook':
			Icon = FaFacebookF;
			break;
		case 'X':
			Icon = FaXTwitter;
			break;
		case 'Pintrest':
			Icon = FaPinterestP;
			break;
		case 'Instagram':
			Icon = AiFillInstagram;
			break;
		case 'YouTube':
			Icon = FaYoutube;
			break;
		default:
			Icon = FaFacebookF;
	}

	return (
		<>
			<Link to={'https://' + props.url} target='_blank' className='p-1 block'>
				<Icon className='hover:text-secondary-dark w-4 h-4 text-gray-600' />
			</Link>
		</>
	);
};

export default SocialMedia;
