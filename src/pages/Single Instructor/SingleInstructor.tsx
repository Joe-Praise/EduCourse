import { FC } from 'react';
import { useParams } from 'react-router-dom';

const SingleInstructor: FC = () => {
	const { slug } = useParams();
	return <div>SingleInstructor: {slug}</div>;
};

export default SingleInstructor;
