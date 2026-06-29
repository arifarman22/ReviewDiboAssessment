import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const isApiActive = (): boolean => {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_API_URL;
};

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Retry logic for 5xx errors and timeouts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config || !config.retryCount) {
      config.retryCount = 0;
    }

    const MAX_RETRIES = 2;
    if (config.retryCount < MAX_RETRIES && (error.code === 'ECONNABORTED' || !error.response || error.response.status >= 500)) {
      config.retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, config.retryCount * 1000));
      return api(config);
    }

    return Promise.reject(error);
  }
);
