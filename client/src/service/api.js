import axios from 'axios';

// Configuración de la URL base según el entorno
const getBaseURL = () => {
    // En producción, usar la variable de entorno
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // En desarrollo, usar localhost
    return 'http://localhost:7001/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// Interceptor para agregar el JWT token a todas las requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido, limpiar localStorage
            localStorage.removeItem('authToken');
        }
        return Promise.reject(error);
    }
);

export default api;
