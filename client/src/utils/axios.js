import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5050/api',
    withCredentials: true,
});

const getNewAccessToken = async () => {
    try {
        const res = await axios.post('http://localhost:5050/api/auth/refresh-token', {}, {
        withCredentials: true,
        });
        return res.data.token;
    } catch (error) {
        console.error("Refresh token failed", error);
        return null;
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newToken = await getNewAccessToken();
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
        }
        }

        return Promise.reject(error);
    }
);

export default api;
