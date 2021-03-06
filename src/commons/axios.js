import _axios from 'axios';
const axios = (baseURL) => {
	const instance = _axios.create({
		baseURL: baseURL || 'http://localhost:3003',
		timeout: 1000
	});

	instance.interceptors.request.use(
		(config) => {
			// Do something before request is sent
			const jwToken = global.auth.getToken();
			config.headers['Authorization'] = 'Bearer ' + jwToken;
			return config;
		},
		(error) => {
			// Do something with request error
			return Promise.reject(error);
		}
	);
	return instance;
};
export { axios };
export default axios();
