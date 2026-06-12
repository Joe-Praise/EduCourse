import { FC } from 'react';
import { SigninForm } from '../../components/Signin';
import img from '../../assets/image/card5.jpg';
import FormLayout from '../../widgets/FormLayout';

const Signin: FC = () => (
	<FormLayout
		imageSide='left'
		imageSrc={img}
		caption='“The room you walk into the morning you finish a course.”'
	>
		<SigninForm />
	</FormLayout>
);

export default Signin;
