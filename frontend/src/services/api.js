import axios from 'axios';

const apiBaseURL = "https://dress-dyo9.onrender.com/api";

const api = axios.create({ baseURL: apiBaseURL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('alnisa-admin-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(undefined, (error) => {
  const proxyUnavailable = error.response?.status >= 500 && !error.response.data?.message;
  if (!error.response || error.code === 'ERR_NETWORK' || proxyUnavailable) {
    error.isApiUnavailable = true;
    const target = apiBaseURL.startsWith('http') ? apiBaseURL : 'port 4000';
    error.message = import.meta.env.DEV
      ? `Unable to reach the AL API (${target}). Check that the backend server is running and reachable.`
      : 'Unable to reach the AL API. Check the API URL configured for this site.';
  }
  return Promise.reject(error);
});

export default api;
