// app/_utils/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || 'access_token';
      const token = localStorage.getItem(tokenKey);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
