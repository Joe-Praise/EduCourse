export const getLocalStorage = (key: string) => {
	try {
		const jsonData = localStorage.getItem(key);
		if (!jsonData) return null;
		return JSON.parse(jsonData);
	} catch (error) {
		return null;
	}
};

export const saveLocalStorage = (data: any, key: string) => {
	try {
		const jsonData = JSON.stringify(data);
		localStorage.setItem(key, jsonData);
		return true;
	} catch (error) {
		return false;
	}
};

export const removeLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
		return;
	} catch (error) {
		return false;
	}
};

export const checkToken = (key: string) => {
	const token = getLocalStorage(key);

	return !!token;
};

export const handleApiError = async (error: any) => {
	try {
		const errorMessage =
			error.response?.data?.message || 'An unexpected error occurred.';
		return errorMessage;
	} catch (err) {
		throw new Error('An unexpected error occurred.');
	}
};

export const getUserRole = (key: string) => {
	const roles = ['instructor', 'admin'];
	// let role: Record<string, string> = {};
	let role = '';
	if (roles.includes(key)) {
		role = key;
	}
	return role;
};
