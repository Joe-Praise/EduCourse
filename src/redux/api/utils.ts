import axios, {
	AxiosError,
	// AxiosInstance,
	// AxiosRequestConfig,
	InternalAxiosRequestConfig,
} from 'axios';
import config from '../../../config';
import { getLocalStorage } from '../../util/helperFunctions/helper';
// interface ImportMetaEnv {
//     readonly VITE_BASE_URL: string
//     // more env variables...
//   }

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }
// const BASE_URL = import.meta.env.VITE_BASE_URL as string;
const baseURL: string = config.baseUrl || 'http://localhost:3000';

export const axiosInstance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json, text/plain, */*',
	},
});

const decodeJwt = (jwt: string) => {
	try {
		return atob(jwt);
	} catch (error) {
		return '';
	}
};

const onRequest = (
	request: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> => {
	const userData = getLocalStorage(config.userData);
	const jwt = userData?.token || '';
	const accessToken = decodeJwt(jwt);
	if (!accessToken) return request;

	request.headers!.Authorization = `Bearer ${accessToken}`;
	return request;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, onRequestError);
// type LocalStorageData = {
// 	name: string;
// 	role: string;
// 	token: string;
// };

// const authInterceptor = (req: AxiosRequestConfig) => {
// 	const localStorageData: LocalStorageData | null = JSON.parse(
// 		localStorage.getItem('profile')
// 	);

// 	const accessToken: string | undefined = localStorageData?.token;
// 	// const accessToken: localstorage = JSON.parse(
// 	// 	localStorage.getItem('profile')
// 	// )?.token;
// 	if (accessToken) {
// 		req.headers.Authorization = `Bearer ${accessToken}`;
// 	}

// 	return req;
// };

// API.interceptors.request.use(authInterceptor);

// export const handleApiError = async (error: {
// 	response: { data: { message: string } };
// }) => {
// 	try {
// 		const errorMessage =
// 			error.response?.data?.message || 'An unexpected error occurred.';
// 		const data = null;
// 		return { error: errorMessage, data };
// 	} catch (err) {
// 		throw new Error('An unexpected error occured');
// 	}
// };

// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// type LocalStorageData = {
// 	name: string;
// 	role: string;
// 	token: string;
// };

// type InternalAxiosRequestConfig<T> = AxiosRequestConfig<T> & {
// 	headers: {
// 		Authorization?: string;
// 	};
// };

// const apiBaseUrl = 'https://api.example.com'; // Replace with your API base URL

// const createAxiosInstance = (): AxiosInstance => {
// 	const instance = axios.create({
// 		baseURL: apiBaseUrl,
// 		// You can add other configurations here
// 	});

// 	// Request interceptor
// 	instance.interceptors.request.use(
// 		(config: InternalAxiosRequestConfig) => {
// 			const localStorageData: LocalStorageData | null = JSON.parse(
// 				localStorage.getItem('profile')
// 			);

// 			const accessToken: string | undefined = localStorageData?.token;

// 			if (accessToken) {
// 				config.headers.Authorization = `Bearer ${accessToken}`;
// 			}

// 			return config;
// 		},
// 		(error) => {
// 			// Handle request error
// 			return Promise.reject(error);
// 		}
// 	);

// 	// Response interceptor
// 	instance.interceptors.response.use(
// 		(response: AxiosResponse) => {
// 			// Handle successful responses
// 			return response;
// 		},
// 		(error) => {
// 			// Handle response error
// 			return Promise.reject(error);
// 		}
// 	);

// 	return instance;
// };

// // Usage
// const api = createAxiosInstance();

// // Now you can use the 'api' instance to make requests, and the token will be automatically added to protected routes.
// api
// 	.get('/protected-endpoint')
// 	.then((response) => {
// 		// Handle success
// 		console.log(response.data);
// 	})
// 	.catch((error) => {
// 		// Handle error
// 		console.error(error);
// 	});
