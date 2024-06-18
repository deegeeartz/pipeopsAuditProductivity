import axios from 'axios';
import { getToken, logOutUser } from '../services/auth';
import { toast } from 'react-toastify';

// axios config for server
export const API_URL = 'http://localhost:8080/api';

const client = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
});

// Alter defaults after instance has been created
// client.defaults.headers.common['Authorization'] = getToken();

// Interceptor
client.interceptors.request.use(function (config) {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config; // Make sure to return the modified config object
});

// Add a response interceptor
client.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log('interceptors', error);
		if (error.response.data?.errorObject?.name === 'TokenExpiredError') {
			toast.error(error.response.data?.error ?? 'Token Expired! Please login again.');
			logOutUser();
		}
	}
);

export default client;
