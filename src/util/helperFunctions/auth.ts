import { getLocalStorage } from './helper';

export const isAuthenticated = () => {
	const userData = getLocalStorage('profile');
	const isTokenPassed = userData?.token;

	if (userData && isTokenPassed) {
		return true;
	}
	return false;
};
