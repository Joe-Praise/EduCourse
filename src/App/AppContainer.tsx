import { useDispatch, useSelector } from 'react-redux';
import App from './App';
import { FC, useEffect, useState } from 'react';
import { RootState } from '../redux/reducers';
import Loading from '../pages/Loading';
import { isLoggedIn } from '../redux/actions/authAction';
import { getUserAction } from '../redux/actions/userAction';
import { AppDispatch } from '../redux/store';
import * as types from '../redux/constants/authConstants';
import { useNavigate } from 'react-router-dom';

const AppContainer: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const token = useSelector((state: RootState) => state.auth?.token);
	const [bootstrapping, setBootstrapping] = useState<boolean>(true);

	useEffect(() => {
		const validateToken = async () => {
			try {
				if (token) {
					await dispatch(isLoggedIn(navigate));
					await dispatch(getUserAction());
				} else {
					dispatch({
						type: types.REFRESH_TOKEN_FAIL,
						payload: types.ERROR_MESSAGE,
					});
				}
			} finally {
				setBootstrapping(false);
			}
		};
		validateToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return bootstrapping ? <Loading /> : <App />;
};

export default AppContainer;
