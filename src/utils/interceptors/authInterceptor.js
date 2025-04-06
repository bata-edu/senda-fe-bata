import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Crear una instancia de Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',
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

// Interceptor de respuesta para manejar errores
apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
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
