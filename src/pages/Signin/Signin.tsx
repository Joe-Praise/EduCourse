import { FC } from 'react';
import { FormLayout } from '../../components/shared';
import { SigninForm } from '../../components/Signin';
import img from '../../assets/image/card5.jpg';

const Signin: FC = () => {
	return (
		<main className='h-screen'>
			<FormLayout formDiv={'order-2'} imgDiv={'order-1'} img={img}>
				<SigninForm />
			</FormLayout>
		</main>
	);
};

export default Signin;
