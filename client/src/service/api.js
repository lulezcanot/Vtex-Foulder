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

export default api;
