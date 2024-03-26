import { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialAuthState } from '../redux/actions/authAction';
import { isAuthenticated } from '../util/helperFunctions/auth';
import { user } from '../redux/api/userApi';
import { RootState } from '../redux/store';

type privateRoutetype = {
	user: user;
};

const PrivateRoutes: FC<privateRoutetype> = ({ user }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isAuthenticatedUser = isAuthenticated();
	const loading = useSelector((state: RootState) => state.auth.isLoading);
	// const loading = true;

	useEffect(() => {
		if (!isAuthenticatedUser) {
			// if (loading) {
			dispatch(setInitialAuthState(navigate));
			// }
		}
	}, [dispatch, isAuthenticatedUser, loading, navigate]);

	return isAuthenticatedUser && user && <Outlet />;
};

export default PrivateRoutes;
