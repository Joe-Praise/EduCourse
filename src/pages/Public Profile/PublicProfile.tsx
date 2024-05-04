import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import InstructorProfile from '../../components/Public Profile/InstructorProfile';
import UserProfile from '../../components/Public Profile/UserProfile';
import {
	getPublicProfileAction,
	resetPublicProfileAction,
} from '../../redux/actions/publicProfileAction';
import { useParams } from 'react-router-dom';

const PublicProfile: FC = () => {
	const publicProfile = useSelector(
		(state: RootState) => state.publicProfile.publicProfile
	);
	const { slug } = useParams<{ slug: string }>();
	const slugString: string = slug || '';
	const dispatch: AppDispatch = useDispatch();

	useEffect(() => {
		dispatch(resetPublicProfileAction());
		dispatch(getPublicProfileAction(slugString, null));
	}, [dispatch, slugString]);

	// Conditionally render user profile or instructor profile based on the response gotten from endpoint
	const handlePublicProfileDisplay = () => {
		if (publicProfile?.isInstructor && publicProfile.user._id.length) {
			return <InstructorProfile profileDetails={publicProfile} />;
		} else if (!publicProfile?.isInstructor && publicProfile.user._id.length) {
			return <UserProfile profileDetails={publicProfile} />;
		}
	};

	return <>{handlePublicProfileDisplay()}</>;
};

export default PublicProfile;
