import axios from 'axios';
import { getToken, logOutUser } from '../services/auth';
import { toast } from 'react-toastify';

// axios config for server
export const API_URL = 'http://localhost:8080/api';

const http = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
});

// Alter defaults after instance has been created
// http.defaults.headers.common['Authorization'] = getToken();

// Interceptor
http.interceptors.request.use(function (config) {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config; // Make sure to return the modified config object
});

// Add a response interceptor
http.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log('interceptors: ', error);

		const { status, data } = error.response;
		if (status == 401 || data?.errorObject?.name === 'TokenExpiredError') {
			toast.error(error.response.data?.error ?? 'Invalid Token! Please login again.');
			logOutUser();
			return;
		}

		return Promise.reject(error);
	}
);

export default http;
