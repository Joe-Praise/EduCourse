import { FC } from 'react';
import { FormLayout } from '../../components/shared';
import img from '../../assets/image/card6.jpg';
import { SignupForm } from '../../components/Signup';

const Signup: FC = () => {
	return (
		<main className='h-screen'>
			<FormLayout formDiv={'order-1'} imgDiv={'order-2'} img={img}>
				<SignupForm />
			</FormLayout>
		</main>
	);
};

export default Signup;
