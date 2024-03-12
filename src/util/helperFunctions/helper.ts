import {
	addNotification,
	notificationType,
} from '../../redux/actions/notification';
import { user } from '../../redux/api/userApi';
import { AppDispatch } from '../../redux/store';

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
		// console.log('handleApiError', error);
		const errorMessage =
			error.response?.data?.message || 'An unexpected error occurred.';
		return { error: errorMessage, data: [] };
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

export const capitalizeFirstLetters = (str: string) => {
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
	result = newArr.join(' ');
	return result;
};

export function camelCase(str: string) {
	let splitStr =
		str.indexOf('-') !== -1
			? str.toLowerCase().split('-')
			: str.toLowerCase().split(' ');
	let newArr = [],
		result,
		output;
	for (let i = 0; i < splitStr.length; i++) {
		if (splitStr[i] !== '') {
			let joinedStr = splitStr[i][0].toUpperCase() + splitStr[i].slice(1);
			newArr.push(joinedStr);
		}
	}
	result = newArr.join('');
	output = result[0].toLowerCase() + result.slice(1);
	return output;
}

export const formQueryStr = (queryObj: {}) => {
	const queryArr: string[] = [];
	Object.entries(queryObj).map((obj) => {
		const key = obj[0][0].toLocaleLowerCase() + obj[0].slice(1);
		queryArr.push(key + '=' + obj[1]);
	});

	const queryStr = '?' + queryArr.join('&');
	return queryStr;
};

export const dispatchErrorHandler = (
	dispatch: AppDispatch,
	message: string
) => {
	dispatch(addNotification({ message, type: 'error' }));
};

export const dispatchSuccessHandler = (
	dispatch: AppDispatch,
	message: string,
	type: notificationType['type'] = 'success'
) => {
	dispatch(addNotification({ message, type }));
};

export const throwErrorHandler = (error: string) => {
	if (error) {
		throw new Error(error);
	}
};

export const welcomeGreeting = (user: user) => {
	const greeting = user.name ? `Welcome Back ${user.name}!` : `Welcome Back!`;
	return greeting;
};
