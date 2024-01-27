import { FC } from 'react';
import SignUpForm from '../Signin/Form';
import img from '../../assets/image/card2.jpg';

const Layout: FC = () => {
	return (
		<section className='flex w-full h-full  gap-[0] m-0 '>
			<div className='flex-1 flex justify-center items-center'>
				<SignUpForm />
			</div>
			<figure className=' bg-black md:w-1/2 lg:basis-2/5 hidden md:block'>
				<img
					src={img}
					alt='Signin banner picture'
					className='hidden md:block h-screen w-screen object'
				/>
			</figure>
		</section>
	);
};

export default Layout;
