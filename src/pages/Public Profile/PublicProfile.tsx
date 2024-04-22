import { FC } from 'react';
// import { useParams } from 'react-router-dom';
import UserProfile from '../../components/Public Profile/UserProfile';

const PublicProfile: FC = () => {
	// const { slug } = useParams();

	return (
		<div>
			<UserProfile />
		</div>
	);
};

export default PublicProfile;
