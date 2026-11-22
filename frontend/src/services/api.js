import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: apiBaseURL.replace(/\/$/, ''), withCredentials: true });
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('alnisa-admin-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(undefined, (error) => {
  const proxyUnavailable = error.response?.status >= 500 && !error.response.data?.message;
  if (!error.response || error.code === 'ERR_NETWORK' || proxyUnavailable) {
    error.isApiUnavailable = true;
    error.message = 'Unable to reach the AL API. Check that the backend is running on port 4000.';
  }
  return Promise.reject(error);
});

export default api;
