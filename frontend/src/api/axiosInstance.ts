import axios from 'axios';

export const JWT_TOKEN_KEY = 'jwtToken';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem(JWT_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
