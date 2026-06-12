import { FC } from 'react';
import img from '../../assets/image/card6.jpg';
import { SignupForm } from '../../components/Signup';
import FormLayout from '../../widgets/FormLayout';

const Signup: FC = () => (
	<FormLayout
		imageSide='right'
		imageSrc={img}
		caption='“Every craft begins with the first quiet hour.”'
	>
		<SignupForm />
	</FormLayout>
);

export default Signup;
