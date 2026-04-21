import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, // Let cookies be sent
});

// Request interceptor to add the specific worker token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('worker_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
