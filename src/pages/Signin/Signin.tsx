import { FC } from 'react';
import { SigninForm } from '../../components/Signin';
import img from '../../assets/image/card5.jpg';
import FormLayout from '../../widgets/FormLayout';

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
