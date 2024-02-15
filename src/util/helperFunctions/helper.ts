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

export const copyToClipBoard = (value: any) => {
	navigator.clipboard.writeText(value);
};

export const truncateValue = (value: string, trunc: boolean, limit: number) => {
	const longerThanLimit = value.length > limit;
	if (trunc && longerThanLimit) {
		return value.slice(0, limit) + '...';
	} else {
		return value;
	}
};

export const formatAmount = (amount: number) => {
	const formattedAmount = amount.toLocaleString('en-US');
	return formattedAmount;
};

export const capitalizeFirstLetters = (str: any) => {
	let splitStr =
		str.indexOf('-') !== -1
			? str.toLowerCase().split('-')
			: str.toLowerCase().split(' ');
	let newArr = [],
		result;
	for (let i = 0; i < splitStr.length; i++) {
		if (splitStr[i] !== '') {
			let joinedStr = splitStr[i][0].toUpperCase() + splitStr[i].slice(1);
			newArr.push(joinedStr);
		}
	}
	result = newArr.join('');
	return result;
};
