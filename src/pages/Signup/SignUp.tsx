import { FC } from 'react';
import img from '../../assets/image/card6.jpg';
import { SignupForm } from '../../components/Signup';
import FormLayout from '../../widgets/FormLayout';

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
