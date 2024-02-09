import { useDispatch, useSelector } from 'react-redux';
import App from './App';
import { FC, useEffect } from 'react';
import { RootState } from '../redux/reducers';
import Loading from '../pages/Loading';
import { isLoggedIn } from '../redux/actions/authAction';
import { AppDispatch } from '../redux/store';
import * as types from '../redux/constants/authConstants';

const AppContainer: FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const authdata = useSelector((state: RootState) => state.auth);
	const isLoading = authdata?.isLoading;
	const token = authdata?.token;

	useEffect(() => {
		const Validatetoken = async () => {
			if (token) {
				dispatch(isLoggedIn());
			} else {
				setTimeout(() => {
					dispatch({
						type: types.REFRESH_TOKEN_FAIL,
						payload: types.ERROR_MESSAGE,
					});
				}, 1000);
			}
		};
		Validatetoken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		// <Provider store={store}>
		isLoading ? <Loading /> : <App />
		// </Provider>
	);
};

export default AppContainer;
