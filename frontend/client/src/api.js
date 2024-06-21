import axios from 'axios';

const api = axios.create ({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
            }
});

api.interceptors.request.use(function(config) {
    
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config; 
});

export default api;