import axios from 'axios';

// Always use production backend
const BASE_URL = 'https://vetra-8c5dfe3bdee7.herokuapp.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server took too long to respond');
      return Promise.reject(new Error('Сервер не відповідає. Будь ласка, спробуйте пізніше.'));
    }

    if (!error.response) {
      console.error('Network error - no response from server:', error);
      return Promise.reject(
        new Error("Немає з'єднання з сервером. Перевірте, чи сервер запущено.")
      );
    }

    if (error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
