import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import config from "../../../config";
import { getLocalStorage, saveLocalStorage } from "../../util/helperFunctions/helper";

export const baseURL: string =
  import.meta.env.VITE_MODE === config.ModeConstants.prod
    ? config.prodUrl
    : config.devUrl;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

const onRequest = (
  request: InternalAxiosRequestConfig<any>,
): InternalAxiosRequestConfig<any> => {
  const userData = getLocalStorage(config.userConstant);
  const jwt = userData?.token || "";
  if (!jwt) return request;
  request.headers!.Authorization = `Bearer ${jwt}`;
  return request;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, onRequestError);

// ---------------------------------------------------------------------------
// Response interceptor — 401 → refresh → retry original request
// ---------------------------------------------------------------------------
//
// When the access token expires the server returns 401. We:
//   1. Call POST /users/refresh (uses the httpOnly `rt` cookie — no body
//      needed; the browser sends the cookie because `withCredentials: true`).
//   2. On success, persist the new access token to localStorage so subsequent
//      requests carry it via the Authorization header.
//   3. Re-fire the original request once.
// If the refresh itself fails (401 from /refresh), we let the failure
// propagate — the AuthGuard / idle timer will redirect to /signin.
//
// To avoid an infinite retry loop, each request is tagged with
// `_retry: true` after one attempt; we never retry the same request twice.

interface RetryableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Coalesce concurrent refreshes — if 5 requests fire and all 401, we want a
// single /refresh call, not 5.
let refreshInFlight: Promise<string | null> | null = null;

const performRefresh = async (): Promise<string | null> => {
  try {
    // Use a bare axios call (not our instance) so we don't recurse into
    // this interceptor.
    const { data } = await axios.post(
      `${baseURL}/api/v1/users/refresh`,
      {},
      { withCredentials: true },
    );
    const newToken = data?.token as string | undefined;
    if (!newToken) return null;
    // Persist into the same localStorage shape the rest of the app uses.
    const existing = getLocalStorage(config.userConstant) ?? {};
    saveLocalStorage({ ...existing, token: newToken }, config.userConstant);
    return newToken;
  } catch {
    return null;
  }
};

const REFRESH_EXCLUDED_PATHS = ['/api/v1/users/login', '/api/v1/users/refresh', '/api/v1/users/signup'];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';
    const isAuthExcluded = REFRESH_EXCLUDED_PATHS.some((p) => url.includes(p));

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthExcluded) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshInFlight = refreshInFlight ?? performRefresh();
    const newToken = await refreshInFlight;
    refreshInFlight = null;

    if (!newToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = {
      ...(originalRequest.headers ?? {}),
      Authorization: `Bearer ${newToken}`,
    };
    return axiosInstance.request(originalRequest);
  },
);
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
