import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // backend
    headers: { "Content-Type": "application/json" },
});

// Gán JWT vào request
api.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith("/auth")) {
        return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;