import { useState } from 'react';

type obj = {
	[key: string]: string;
};
export default function useQueryString() {
	const [queryString, setQueryString] = useState({});

	const addQuerySting = (value: obj) => {
		setQueryString({ ...value });
	};
	console.log(queryString);

	const removeQueryString = (value: obj) => {
		console.log(value);
		// const {[value], ...rest}= queryString
	};

	const StringifyQuery = () => {
		console.log(queryString);
	};

	// useEffect(() => {
	// 	const timeout = setTimeout(() => {
	// 		setDebouncedValue(value);
	// 	}, delay);

	// 	return () => clearTimeout(timeout);
	// }, [value, delay]);

	return { queryString, addQuerySting, removeQueryString, StringifyQuery };
}
