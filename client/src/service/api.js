import axios from 'axios';

const api = axios.create({
    baseURL: `http://localhost:7001/api`,
    withCredentials: true,
});

export default api;
