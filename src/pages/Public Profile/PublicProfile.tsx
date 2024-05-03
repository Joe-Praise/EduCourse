import { FC } from 'react';
// import { useParams } from 'react-router-dom';
import UserProfile from '../../components/Public Profile/UserProfile';

const PublicProfile: FC = () => {
	// const { slug } = useParams();

	// Conditionally render user profile or instructor profile based on the response gotten from endpoint

	return (
		<div>
			<UserProfile />
		</div>
	);
};

export default PublicProfile;
