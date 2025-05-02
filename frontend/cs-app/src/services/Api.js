import axios from 'axios';

const API = axios.create({
  timeout: 10000,  // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true  // For cookies/CORS
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    // Add auth token if exists
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

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = '/login';  // Redirect on unauthorized
          break;
        case 500:
          console.error('Server Error:', error);
          break;
        default:
          console.error('API Error:', error);
      }
    } else if (error.request) {
      console.error('Network Error:', 'No response received');
    } else {
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const fetchData = async (endpoint) => {
  try {
    const response = await API.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await API.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to post to ${endpoint}: ${error.message}`);
  }
};

export default API;