import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Crear una instancia de Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (!config.url.includes('/auth') && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar 401 y hacer refresh del token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'}/auth/refresh-tokens`,
          { refreshToken }
        );

        const { access, refresh } = res.data.tokens;

        localStorage.setItem('token', access.token);
        localStorage.setItem('refreshToken', refresh.token);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access.token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access.token}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }

    toast.error(`Error: ${error.response?.data?.message || error.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
