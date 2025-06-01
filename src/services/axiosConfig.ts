import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://vetra-8c5dfe3bdee7.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
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
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

 
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
      
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
       
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/api/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
         
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          
         
          processQueue(null, response.data.accessToken);
          
        
          return axiosInstance(originalRequest);
        } else {
          processQueue(error, null);
        
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
     
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

   
    return Promise.reject(error);
  }
);

export default axiosInstance; 