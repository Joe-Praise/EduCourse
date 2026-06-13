import { Link } from 'react-router-dom';

const Logo = () => {
	return (
		<Link to={'/'} className='block cursor-pointer'>
			<span className='font-exo font-bold text-xl tracking-tight'>
				<span className='gradient-text'>Edu</span>
				<span className='text-white'>Course</span>
			</span>
		</Link>
	);
};

export default Logo;
