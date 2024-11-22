import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8800/api/", // Base URL for the backend API
  withCredentials: true, // Include credentials (e.g., cookies) in requests
});

// Interceptor to add the token to headers
newRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to request headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
