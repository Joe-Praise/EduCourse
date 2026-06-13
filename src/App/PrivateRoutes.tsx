import { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAction, setInitialAuthState } from '../redux/actions/authAction';
import { AppDispatch } from '../redux/store';
import { isAuthenticated } from '../util/helperFunctions/auth';
import { user } from '../redux/api/userApi';
import LoadingEffect from '../components/shared/LoadingEffect';
import { useNotificationStream } from '../hooks/useNotificationStream';
import { useIdleTimer } from '../hooks/useIdleTimer';

type privateRoutetype = {
	user: user;
};

const PrivateRoutes: FC<privateRoutetype> = ({ user }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	// Open the SSE stream once the user is authenticated. The hook no-ops
	// when there's no user, and tears down cleanly on sign-out.
	useNotificationStream();

	const isAuthenticatedUser = isAuthenticated();

	// Log out after 30 minutes of no user activity. Enabled only while the
	// session is valid; pauses automatically when the user is already
	// signed out. The logoutAction itself calls the server-side revoke.
	useIdleTimer({
		enabled: isAuthenticatedUser,
		onIdle: () => {
			dispatch(logoutAction(navigate));
		},
	});

	useEffect(() => {
		if (!isAuthenticatedUser) {
			dispatch(setInitialAuthState(navigate));
		}
	}, [dispatch, isAuthenticatedUser, navigate]);

	if (!isAuthenticatedUser) return null;

	// User has a valid token but the userObj is still rehydrating — wait for it
	// rather than rendering the protected child with an empty user.
	if (!user?._id) {
		return (
			<div className='py-24 grid place-items-center'>
				<LoadingEffect />
			</div>
		);
	}

	return <Outlet />;
};

export default PrivateRoutes;
