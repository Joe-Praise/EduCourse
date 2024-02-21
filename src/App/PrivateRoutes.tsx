import { FC, useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setInitialAuthState } from '../redux/actions/authAction';
import { isAuthenticated } from '../util/helperFunctions/auth';
import { user } from '../redux/api/userApi';

type privateRoutetype = {
	user: user;
};
const PrivateRoutes: FC<privateRoutetype> = ({ user }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isAuthenticatedUser = isAuthenticated();
	// const loading = true;

	useEffect(() => {
		if (!isAuthenticatedUser) {
			dispatch(setInitialAuthState(navigate));
		}
	}, [dispatch, isAuthenticatedUser, navigate]);

	return isAuthenticatedUser && user && <Outlet />;
};

export default PrivateRoutes;
