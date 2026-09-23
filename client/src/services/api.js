import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cortex_token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle credit depletion / auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 402) {
      window.dispatchEvent(new CustomEvent('cortex:open-credit-modal', {
        detail: { message: error.response?.data?.message || 'Insufficient credits.' }
      }));
    }
    return Promise.reject(error);
  }
);

export default api;
