import axios from 'axios';

// Centralized Axios API instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('templatehub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 unauthorized errors
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      // If it's not a login/register attempt, remove stale token to avoid invalid loops
      if (!isAuthRoute) {
        localStorage.removeItem('templatehub_token');
        localStorage.removeItem('templatehub_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
