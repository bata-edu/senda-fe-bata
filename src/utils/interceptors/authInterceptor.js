import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud: agregar token a todas menos /log_in o /register
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!config.url.includes("/log_in") && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: manejar errores 401 sin refresh
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // El token ya no sirve o no se mandó bien
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // si guardás user
      toast.error("Sesión expirada. Iniciá sesión nuevamente.");
    } else {
      toast.error(`Error: ${error.response?.data?.error || error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
