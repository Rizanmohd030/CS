import axios from 'axios';

// Configure Axios to point to your backend
const API = axios.create({
  baseURL: 'http://localhost:5000', // Your backend URL
  timeout: 5000, // Optional: Set request timeout
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

// Request interceptor (for adding auth tokens later)
API.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;