import { Link } from 'react-router-dom';

const Logo = () => {
	return (
		<Link to={'/'} className='block cursor-pointer'>
			<span className=''>
				<span className=' leading-[.2] text-secondary-dark text-xl'>Edu</span>
				<span className='text-secondary-light text-xl'>Course</span>
			</span>
		</Link>
	);
};

export default Logo;
